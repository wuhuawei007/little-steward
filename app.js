const STORAGE_KEY = "little-steward-v1";
const SUPABASE_CONFIG_KEY = "little-steward-supabase-config";
const colors = ["#4b73e8", "#ea8a3c", "#8671df", "#1f9d68", "#e2799c", "#575a63"];
const icons = { property: "⌂", cash: "$", stock: "↗", fund: "F", crypto: "₿", loan: "−", other: "•" };
const labels = { property: "房产", cash: "现金存款", stock: "股票", fund: "基金", crypto: "Crypto", loan: "贷款", other: "其他" };

const seedData = {
  currency: "AUD",
  accounts: [
    { id: "a1", name: "自住房", type: "property", kind: "asset", value: 980000, note: "布里斯班自住房", updated: "2026-06-15" },
    { id: "a2", name: "投资房", type: "property", kind: "asset", value: 620000, note: "长期持有", updated: "2026-06-12" },
    { id: "a3", name: "活期与储蓄", type: "cash", kind: "asset", value: 86500, note: "日常及紧急备用金", updated: "2026-05-31" },
    { id: "a4", name: "股票组合", type: "stock", kind: "asset", value: 128400, note: "澳股与美股", updated: "2026-06-14" },
    { id: "a5", name: "基金", type: "fund", kind: "asset", value: 74200, note: "指数基金", updated: "2026-06-10" },
    { id: "a6", name: "Crypto", type: "crypto", kind: "asset", value: 36800, note: "长期仓位", updated: "2026-06-15" },
    { id: "l1", name: "自住房贷款", type: "loan", kind: "liability", value: 510000, note: "浮动利率", updated: "2026-05-31" },
    { id: "l2", name: "投资房贷款", type: "loan", kind: "liability", value: 390000, note: "Interest only", updated: "2026-05-31" }
  ],
  savings: [
    { id: "s1", month: "2026-05", amount: 86500, note: "本月旅行支出较多，但储蓄目标仍然达成。" },
    { id: "s2", month: "2026-04", amount: 82400, note: "收到季度奖金。" },
    { id: "s3", month: "2026-03", amount: 76100, note: "开始提高每月自动转账金额。" },
    { id: "s4", month: "2026-02", amount: 70500, note: "" },
    { id: "s5", month: "2026-01", amount: 66800, note: "新年财务计划启动。" },
    { id: "s6", month: "2025-12", amount: 63000, note: "" }
  ],
  notes: [
    { id: "n1", title: "六月计划", body: "月底更新房产估值，复盘股票配置，并保持紧急备用金至少覆盖 6 个月支出。", date: "2026-06-15" },
    { id: "n2", title: "投资原则", body: "不追逐短期波动。每次新增投资前，先确认长期逻辑和最大可接受亏损。", date: "2026-06-08" },
    { id: "n3", title: "贷款提醒", body: "8 月前比较一次投资房贷款利率。", date: "2026-05-28" }
  ]
};

let data = loadData();
let privacy = false;
let activeFilter = "all";
let editorState = null;
let cloud = {
  client: null,
  session: null,
  syncing: false,
  config: loadSupabaseConfig(),
  diagnostic: "配置保存后，可以先测试连接。",
  diagnosticType: ""
};
let localDataExists = Boolean(localStorage.getItem(STORAGE_KEY));

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seedData); }
  catch { return structuredClone(seedData); }
}
function saveLocalData() {
  localDataExists = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadSupabaseConfig() {
  try { return JSON.parse(localStorage.getItem(SUPABASE_CONFIG_KEY)) || { url: "", anonKey: "" }; }
  catch { return { url: "", anonKey: "" }; }
}
function saveSupabaseConfig(config) {
  cloud.config = config;
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
}
function uid(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${random}`;
}
function money(value, compact = false) {
  if (privacy) return "••••••";
  return new Intl.NumberFormat("zh-CN", {
    style: "currency", currency: data.currency, maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard"
  }).format(value);
}
function totals() {
  const assets = data.accounts.filter(a => a.kind === "asset").reduce((s, a) => s + Number(a.value), 0);
  const liabilities = data.accounts.filter(a => a.kind === "liability").reduce((s, a) => s + Number(a.value), 0);
  return { assets, liabilities, net: assets - liabilities };
}
function dateLabel(date) {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date(date + "T12:00:00"));
}
function monthLabel(month) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" }).format(new Date(month + "-01T12:00:00"));
}
function showToast(text) {
  const el = document.querySelector("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => el.classList.remove("show"), 1800);
}
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}

function render() {
  const t = totals();
  document.querySelector("#netWorth").textContent = money(t.net);
  document.querySelector("#totalAssets").textContent = money(t.assets);
  document.querySelector("#totalLiabilities").textContent = money(t.liabilities);
  document.querySelector("#assetsPageNetWorth").textContent = money(t.net);
  document.querySelector("#privacyIcon").textContent = privacy ? "○" : "◉";

  const sortedSavings = [...data.savings].sort((a, b) => b.month.localeCompare(a.month));
  const current = sortedSavings[0]?.amount || 0;
  const previous = sortedSavings[1]?.amount || 0;
  const change = current - previous;
  document.querySelector("#netChange").textContent = `最近储蓄变化 ${change >= 0 ? "+" : ""}${money(change)}`;
  renderAllocation();
  renderAccounts();
  renderSavings();
  renderNotes();
  renderCloudUI();
}

function renderAllocation() {
  const assets = data.accounts.filter(a => a.kind === "asset");
  const grouped = Object.entries(assets.reduce((g, a) => ((g[a.type] = (g[a.type] || 0) + Number(a.value)), g), {})).sort((a,b) => b[1]-a[1]);
  const total = grouped.reduce((s, [,v]) => s + v, 0) || 1;
  let cursor = 0;
  const stops = grouped.map(([type, value], i) => {
    const start = cursor;
    cursor += value / total * 100;
    return `${colors[i % colors.length]} ${start}% ${cursor}%`;
  });
  document.querySelector("#allocationDonut").style.background = `conic-gradient(${stops.join(",") || "#ddd 0 100%"})`;
  document.querySelector("#assetCount").textContent = assets.length;
  document.querySelector("#allocationLegend").innerHTML = grouped.slice(0, 5).map(([type, value], i) => `
    <div class="legend-row"><i class="legend-dot" style="background:${colors[i % colors.length]}"></i><span>${labels[type] || type}</span><strong>${money(value, true)}</strong></div>
  `).join("") || `<p class="eyebrow">还没有资产</p>`;
}

function accountRow(a, i) {
  return `<button class="account-row" data-edit-account="${a.id}">
    <span class="account-icon" style="background:${a.kind === "liability" ? "#d95050" : colors[i % colors.length]}">${icons[a.type] || "•"}</span>
    <span class="account-copy"><strong>${escapeHtml(a.name)}</strong><span>${escapeHtml(a.note || labels[a.type])}</span></span>
    <span class="account-value"><strong class="${a.kind === "liability" ? "liability-amount" : ""}">${a.kind === "liability" ? "−" : ""}${money(a.value)}</strong><span>${dateLabel(a.updated)} 更新</span></span>
  </button>`;
}
function renderAccounts() {
  const recent = [...data.accounts].sort((a,b) => b.updated.localeCompare(a.updated)).slice(0, 4);
  document.querySelector("#recentAccounts").innerHTML = recent.map(accountRow).join("");
  const filtered = data.accounts.filter(a => activeFilter === "all" || a.kind === activeFilter);
  document.querySelector("#allAccounts").innerHTML = filtered.map(accountRow).join("") || `<div class="card"><p class="eyebrow">这里还没有记录</p></div>`;
}
function renderSavings() {
  const sorted = [...data.savings].sort((a,b) => b.month.localeCompare(a.month));
  const year = new Date().getFullYear().toString();
  const withinYear = sorted.filter(s => s.month.startsWith(year));
  const yearGrowth = withinYear.length > 1 ? withinYear[0].amount - withinYear[withinYear.length - 1].amount : withinYear[0]?.amount || 0;
  document.querySelector("#yearSavings").textContent = money(yearGrowth);
  const chart = [...withinYear].reverse();
  const max = Math.max(...chart.map(s => s.amount), 1);
  document.querySelector("#savingsBars").innerHTML = chart.map(s => `<i class="spark-bar" style="height:${Math.max(12, s.amount/max*100)}%" title="${s.month}"></i>`).join("");
  document.querySelector("#savingsTimeline").innerHTML = sorted.map(s => `
    <button class="timeline-item" data-edit-saving="${s.id}" style="border:0;background:transparent;padding:0;text-align:left;color:inherit">
      <span class="timeline-mark"></span>
      <span class="timeline-content"><span class="timeline-top"><strong>${monthLabel(s.month)}</strong><strong>${money(s.amount)}</strong></span>${s.note ? `<p>${escapeHtml(s.note)}</p>` : ""}</span>
    </button>`).join("") || `<div class="card"><p class="eyebrow">记录第一个月末余额吧</p></div>`;
}
function renderNotes() {
  document.querySelector("#notesGrid").innerHTML = [...data.notes].sort((a,b) => b.date.localeCompare(a.date)).map(n => `
    <button class="note-card" data-edit-note="${n.id}"><span>${dateLabel(n.date)}</span><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.body)}</p></button>
  `).join("") || `<div class="note-card"><h3>还没有 Notes</h3><p>记下你的第一个财务决定。</p></div>`;
}
function renderCloudUI() {
  const hasConfig = Boolean(cloud.config.url && cloud.config.anonKey);
  const email = cloud.session?.user?.email;
  const status = document.querySelector("#cloudStatus");
  document.querySelector("#supabaseUrlInput").value = cloud.config.url || "";
  document.querySelector("#supabaseAnonInput").value = cloud.config.anonKey || "";
  document.querySelector("#authBox").classList.toggle("hidden", !hasConfig || Boolean(email));
  document.querySelector("#signedInBox").classList.toggle("hidden", !email);
  document.querySelector("#syncNowButton").disabled = !email || cloud.syncing;
  document.querySelector("#pullCloudButton").disabled = !email || cloud.syncing;
  document.querySelector("#testSupabaseConnection").disabled = !hasConfig || cloud.syncing;
  document.querySelector("#signedInText").textContent = email ? `已登录：${email}` : "";
  status.textContent = !hasConfig ? "未配置" : email ? (cloud.syncing ? "正在同步..." : "已登录并可同步") : "已配置，等待登录";
  const diagnostic = document.querySelector("#cloudDiagnostic");
  diagnostic.textContent = cloud.diagnostic;
  diagnostic.className = `cloud-diagnostic ${cloud.diagnosticType}`;
}

function field(label, name, value = "", type = "text", extra = "") {
  return `<label class="field"><span>${label}</span><input name="${name}" type="${type}" value="${escapeHtml(String(value))}" ${extra}></label>`;
}
function openEditor(type, id = null) {
  editorState = { type, id };
  const dialog = document.querySelector("#editorDialog");
  const fields = document.querySelector("#formFields");
  const deleteBtn = document.querySelector("#deleteButton");
  deleteBtn.classList.toggle("hidden", !id);
  if (type === "account") {
    const item = data.accounts.find(a => a.id === id) || { name:"", type:"property", kind:"asset", value:"", note:"", updated:new Date().toISOString().slice(0,10) };
    document.querySelector("#dialogTitle").textContent = id ? "编辑账户" : "添加资产或负债";
    fields.innerHTML = `${field("名称", "name", item.name, "text", "required")}
      <label class="field"><span>类别</span><select name="type">${Object.entries(labels).map(([v,l]) => `<option value="${v}" ${item.type === v ? "selected":""}>${l}</option>`).join("")}</select></label>
      <label class="field"><span>性质</span><select name="kind"><option value="asset" ${item.kind === "asset" ? "selected":""}>资产</option><option value="liability" ${item.kind === "liability" ? "selected":""}>负债</option></select></label>
      ${field("当前价值", "value", item.value, "number", "min='0' step='0.01' required")}${field("备注", "note", item.note)}${field("更新日期", "updated", item.updated, "date", "required")}`;
  } else if (type === "saving") {
    const item = data.savings.find(s => s.id === id) || { month:new Date().toISOString().slice(0,7), amount:"", note:"" };
    document.querySelector("#dialogTitle").textContent = id ? "编辑月末记录" : "记录月末余额";
    fields.innerHTML = `${field("月份", "month", item.month, "month", "required")}${field("储蓄与活期余额", "amount", item.amount, "number", "min='0' step='0.01' required")}
      <label class="field"><span>Notes</span><textarea name="note" placeholder="这个月发生了什么？">${escapeHtml(item.note)}</textarea></label>`;
  } else {
    const item = data.notes.find(n => n.id === id) || { title:"", body:"", date:new Date().toISOString().slice(0,10) };
    document.querySelector("#dialogTitle").textContent = id ? "编辑 Note" : "添加 Note";
    fields.innerHTML = `${field("标题", "title", item.title, "text", "required")}<label class="field"><span>内容</span><textarea name="body" required>${escapeHtml(item.body)}</textarea></label>${field("日期", "date", item.date, "date", "required")}`;
  }
  dialog.showModal();
}

async function persistData(message = "已保存") {
  saveLocalData();
  render();
  if (cloud.session) await syncToCloud({ quiet: true });
  showToast(message);
}
function ensureSupabaseClient() {
  if (!cloud.config.url || !cloud.config.anonKey || !window.supabase?.createClient) return null;
  if (!cloud.client) {
    cloud.client = window.supabase.createClient(cloud.config.url, cloud.config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    cloud.client.auth.onAuthStateChange(async (_event, session) => {
      cloud.session = session;
      renderCloudUI();
      if (session) await reconcileCloudOnLogin();
    });
  }
  return cloud.client;
}
async function initCloud() {
  const client = ensureSupabaseClient();
  if (!client) {
    renderCloudUI();
    return;
  }
  const { data: sessionData } = await client.auth.getSession();
  cloud.session = sessionData.session;
  renderCloudUI();
  if (cloud.session) await reconcileCloudOnLogin();
}
async function signInWithEmail() {
  const client = ensureSupabaseClient();
  const email = document.querySelector("#authEmailInput").value.trim();
  if (!client) return showToast("请先保存 Supabase 配置");
  if (!email) return showToast("请输入邮箱");
  try {
    cloud.diagnostic = "正在向 Supabase 发送登录邮件请求...";
    cloud.diagnosticType = "";
    renderCloudUI();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: location.origin + location.pathname }
    });
    if (error) throw error;
    cloud.diagnostic = `Supabase 已接受请求：登录链接已发送到 ${email}。如果没收到，请看 Authentication → Logs。`;
    cloud.diagnosticType = "ok";
    renderCloudUI();
    showToast("登录链接已发送，请查看邮箱");
  } catch (error) {
    cloud.diagnostic = `发送失败：${error.message || error}`;
    cloud.diagnosticType = "error";
    renderCloudUI();
    showToast("发送失败，请查看诊断信息");
  }
}
async function testSupabaseConnection() {
  const client = ensureSupabaseClient();
  if (!client) return showToast("请先保存 Supabase 配置");
  cloud.syncing = true;
  cloud.diagnostic = "正在测试 Supabase 连接...";
  cloud.diagnosticType = "";
  renderCloudUI();
  try {
    const { error } = await client.from("little_steward_settings").select("user_id").limit(1);
    if (error) throw error;
    cloud.diagnostic = "连接成功：Project URL、Publishable Key、数据库表都可以访问。现在可以发送登录链接。";
    cloud.diagnosticType = "ok";
    showToast("Supabase 连接成功");
  } catch (error) {
    cloud.diagnostic = `连接失败：${error.message || error}`;
    cloud.diagnosticType = "error";
    showToast("连接失败，请查看诊断信息");
  } finally {
    cloud.syncing = false;
    renderCloudUI();
  }
}
async function signOut() {
  if (!cloud.client) return;
  await cloud.client.auth.signOut();
  cloud.session = null;
  renderCloudUI();
  showToast("已退出登录");
}
function withUserId(rows) {
  const userId = cloud.session.user.id;
  return rows.map(row => ({ ...row, user_id: userId, updated_at: new Date().toISOString() }));
}
async function reconcileCloudOnLogin() {
  try {
    const remote = await fetchCloudData();
    if (!remote) return;
    const hasRemote = remote.accounts.length || remote.savings.length || remote.notes.length;
    if (!hasRemote) {
      await syncToCloud({ quiet: true });
    } else if (localDataExists) {
      data = {
        currency: remote.currency || data.currency,
        accounts: mergeById(data.accounts, remote.accounts),
        savings: mergeById(data.savings, remote.savings),
        notes: mergeById(data.notes, remote.notes)
      };
      saveLocalData();
      render();
      await syncToCloud({ quiet: true });
    } else {
      data = remote;
      saveLocalData();
      render();
    }
  } catch (error) {
    showToast(`云同步初始化失败：${error.message}`);
  }
}
async function syncToCloud({ quiet = false } = {}) {
  const client = ensureSupabaseClient();
  if (!client || !cloud.session || cloud.syncing) return;
  cloud.syncing = true;
  renderCloudUI();
  try {
    const userId = cloud.session.user.id;
    const accounts = withUserId(data.accounts.map(a => ({ ...a, value: Number(a.value) || 0 })));
    const savings = withUserId(data.savings.map(s => ({ ...s, amount: Number(s.amount) || 0 })));
    const notes = withUserId(data.notes);
    const settings = { user_id: userId, currency: data.currency, updated_at: new Date().toISOString() };
    if (accounts.length) await throwIfError(client.from("little_steward_accounts").upsert(accounts));
    if (savings.length) await throwIfError(client.from("little_steward_savings").upsert(savings));
    if (notes.length) await throwIfError(client.from("little_steward_notes").upsert(notes));
    await throwIfError(client.from("little_steward_settings").upsert(settings));
    if (!quiet) showToast("已同步到云端");
  } catch (error) {
    showToast(`同步失败：${error.message}`);
  } finally {
    cloud.syncing = false;
    renderCloudUI();
  }
}
async function fetchCloudData() {
  const client = ensureSupabaseClient();
  if (!client || !cloud.session) return null;
  const [accountsRes, savingsRes, notesRes, settingsRes] = await Promise.all([
    client.from("little_steward_accounts").select("id,name,type,kind,value,note,updated"),
    client.from("little_steward_savings").select("id,month,amount,note"),
    client.from("little_steward_notes").select("id,title,body,date"),
    client.from("little_steward_settings").select("currency").maybeSingle()
  ]);
  [accountsRes, savingsRes, notesRes, settingsRes].forEach(throwIfErrorSync);
  return {
    currency: settingsRes.data?.currency || data.currency,
    accounts: accountsRes.data || [],
    savings: savingsRes.data || [],
    notes: notesRes.data || []
  };
}
async function pullFromCloud({ quiet = false, merge = false } = {}) {
  if (cloud.syncing) return;
  cloud.syncing = true;
  renderCloudUI();
  try {
    const remote = await fetchCloudData();
    if (!remote) return;
    if (merge) {
      data = {
        currency: remote.currency,
        accounts: mergeById(data.accounts, remote.accounts),
        savings: mergeById(data.savings, remote.savings),
        notes: mergeById(data.notes, remote.notes)
      };
    } else {
      data = remote;
    }
    saveLocalData();
    render();
    if (!quiet) showToast("已从云端恢复");
  } catch (error) {
    showToast(`恢复失败：${error.message}`);
  } finally {
    cloud.syncing = false;
    renderCloudUI();
  }
}
function mergeById(localRows, remoteRows) {
  const map = new Map();
  [...localRows, ...remoteRows].forEach(row => map.set(row.id, { ...map.get(row.id), ...row }));
  return Array.from(map.values());
}
async function deleteFromCloud(type, id) {
  const client = ensureSupabaseClient();
  if (!client || !cloud.session) return;
  const table = {
    account: "little_steward_accounts",
    saving: "little_steward_savings",
    note: "little_steward_notes"
  }[type];
  if (!table) return;
  await throwIfError(client.from(table).delete().eq("id", id));
}
async function throwIfError(request) {
  const result = await request;
  if (result.error) throw result.error;
  return result;
}
function throwIfErrorSync(result) {
  if (result.error) throw result.error;
}

document.addEventListener("click", e => {
  const nav = e.target.closest("[data-page], [data-target-page]");
  if (nav) switchPage(nav.dataset.page || nav.dataset.targetPage);
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "add-asset") openEditor("account");
  if (action === "add-saving") openEditor("saving");
  if (action === "add-note") openEditor("note");
  const account = e.target.closest("[data-edit-account]")?.dataset.editAccount;
  const saving = e.target.closest("[data-edit-saving]")?.dataset.editSaving;
  const note = e.target.closest("[data-edit-note]")?.dataset.editNote;
  if (account) openEditor("account", account);
  if (saving) openEditor("saving", saving);
  if (note) openEditor("note", note);
});
function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  document.querySelector("#pageTitle").textContent = ({ overviewPage:"我的资产", assetsPage:"资产与负债", savingsPage:"储蓄记录", notesPage:"Notes" })[id];
  scrollTo({ top: 0, behavior: "smooth" });
}
document.querySelector("#assetSegment").addEventListener("click", e => {
  if (!e.target.dataset.filter) return;
  activeFilter = e.target.dataset.filter;
  document.querySelectorAll("#assetSegment button").forEach(b => b.classList.toggle("active", b === e.target));
  renderAccounts();
});
document.querySelector("#togglePrivacy").onclick = () => { privacy = !privacy; render(); };
document.querySelector("#cancelDialog").onclick = () => document.querySelector("#editorDialog").close();
document.querySelector("#editorForm").onsubmit = async e => {
  e.preventDefault();
  const values = Object.fromEntries(new FormData(e.currentTarget));
  const { type, id } = editorState;
  if (type === "account") {
    values.value = Number(values.value);
    values.id = id || uid("a");
    data.accounts = id ? data.accounts.map(x => x.id === id ? values : x) : [...data.accounts, values];
  } else if (type === "saving") {
    values.amount = Number(values.amount);
    values.id = id || uid("s");
    data.savings = id ? data.savings.map(x => x.id === id ? values : x) : [...data.savings, values];
  } else {
    values.id = id || uid("n");
    data.notes = id ? data.notes.map(x => x.id === id ? values : x) : [...data.notes, values];
  }
  document.querySelector("#editorDialog").close();
  await persistData("已保存");
};
document.querySelector("#deleteButton").onclick = async () => {
  const { type, id } = editorState;
  if (type === "account") data.accounts = data.accounts.filter(x => x.id !== id);
  if (type === "saving") data.savings = data.savings.filter(x => x.id !== id);
  if (type === "note") data.notes = data.notes.filter(x => x.id !== id);
  document.querySelector("#editorDialog").close();
  try { await deleteFromCloud(type, id); }
  catch (error) { showToast(`云端删除失败：${error.message}`); }
  await persistData("已删除");
};
document.querySelector("#settingsButton").onclick = () => document.querySelector("#settingsDialog").showModal();
document.querySelector("#closeSettings").onclick = () => document.querySelector("#settingsDialog").close();
document.querySelector("#currencySelect").onchange = async e => {
  data.currency = e.target.value;
  await persistData("货币已更新");
};
document.querySelector("#resetData").onclick = async () => {
  data = structuredClone(seedData);
  document.querySelector("#settingsDialog").close();
  await persistData("已恢复示例数据");
};
document.querySelector("#saveSupabaseConfig").onclick = async () => {
  const url = document.querySelector("#supabaseUrlInput").value.trim().replace(/\/$/, "");
  const anonKey = document.querySelector("#supabaseAnonInput").value.trim();
  if (!url || !anonKey) return showToast("请填写 URL 和 anon public key");
  saveSupabaseConfig({ url, anonKey });
  cloud.client = null;
  cloud.diagnostic = "配置已保存。请点击“测试 Supabase 连接”。";
  cloud.diagnosticType = "";
  await initCloud();
  showToast("Supabase 配置已保存");
};
document.querySelector("#sendLoginLink").onclick = signInWithEmail;
document.querySelector("#testSupabaseConnection").onclick = testSupabaseConnection;
document.querySelector("#signOutButton").onclick = signOut;
document.querySelector("#syncNowButton").onclick = () => syncToCloud();
document.querySelector("#pullCloudButton").onclick = () => pullFromCloud();

document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("zh-CN", { month:"long", day:"numeric", weekday:"long" }).format(new Date());
document.querySelector("#currencySelect").value = data.currency;
render();
initCloud();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
