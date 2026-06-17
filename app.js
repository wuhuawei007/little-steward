const STORAGE_KEY = "little-steward-v1";
const SUPABASE_CONFIG_KEY = "little-steward-supabase-config";
const BIOMETRIC_KEY = "little-steward-biometric";
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
  ],
  goals: [
    { id: "g1", name: "净资产目标", target: 1000000, currentType: "netWorth", due: "2027-12", note: "先达成第一个百万净资产里程碑。" },
    { id: "g2", name: "现金安全垫", target: 100000, currentType: "cash", due: "2026-12", note: "覆盖 6-9 个月生活支出。" }
  ],
  budget: { monthlyIncome: 14000, fixedExpense: 5200, flexExpense: 2600, savingTarget: 4500 },
  loanPlan: { principal: 900000, annualRate: 6.1, monthlyRepayment: 5600, offsetBalance: 86500 },
  snapshots: [
    { id: "p1", month: "2026-01", assets: 1820000, liabilities: 930000 },
    { id: "p2", month: "2026-02", assets: 1845000, liabilities: 925000 },
    { id: "p3", month: "2026-03", assets: 1870000, liabilities: 918000 },
    { id: "p4", month: "2026-04", assets: 1905000, liabilities: 910000 },
    { id: "p5", month: "2026-05", assets: 1923900, liabilities: 900000 }
  ],
  priceWatch: [
    { id: "w1", accountId: "a6", name: "Bitcoin", symbol: "BTC", source: "coingecko", coingeckoId: "bitcoin", quantity: 0.32, price: 115000, currency: "AUD", change24h: 0, updatedAt: "" },
    { id: "w2", accountId: "a4", name: "股票组合", symbol: "STOCKS", source: "manual", coingeckoId: "", quantity: 1, price: 128400, currency: "AUD", change24h: 0, updatedAt: "" },
    { id: "w3", accountId: "a5", name: "基金", symbol: "FUNDS", source: "manual", coingeckoId: "", quantity: 1, price: 74200, currency: "AUD", change24h: 0, updatedAt: "" }
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
let biometric = loadBiometricConfig();

function loadData() {
  try { return normalizeData(JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seedData)); }
  catch { return structuredClone(seedData); }
}
function normalizeData(raw) {
  const defaults = structuredClone(seedData);
  return {
    ...defaults,
    ...raw,
    accounts: raw.accounts || defaults.accounts,
    savings: raw.savings || defaults.savings,
    notes: raw.notes || defaults.notes,
    goals: raw.goals || defaults.goals,
    budget: { ...defaults.budget, ...(raw.budget || {}) },
    loanPlan: { ...defaults.loanPlan, ...(raw.loanPlan || {}) },
    snapshots: raw.snapshots || defaults.snapshots,
    priceWatch: raw.priceWatch || defaults.priceWatch
  };
}
function saveLocalData() {
  localDataExists = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadSupabaseConfig() {
  try { return JSON.parse(localStorage.getItem(SUPABASE_CONFIG_KEY)) || { url: "", anonKey: "" }; }
  catch { return { url: "", anonKey: "" }; }
}
function loadBiometricConfig() {
  try { return JSON.parse(localStorage.getItem(BIOMETRIC_KEY)) || { enabled: false, credentialId: "" }; }
  catch { return { enabled: false, credentialId: "" }; }
}
function saveBiometricConfig(config) {
  biometric = config;
  localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(config));
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
  renderInsights(t);
  renderAccounts();
  renderSavings();
  renderPlanning();
  renderPrices();
  renderNotes();
  renderCloudUI();
  renderSecurityUI();
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

function renderInsights(t = totals()) {
  const latestSavings = [...data.savings].sort((a, b) => b.month.localeCompare(a.month));
  const cash = data.accounts.filter(a => a.kind === "asset" && a.type === "cash").reduce((s, a) => s + Number(a.value), 0);
  const liquid = data.accounts.filter(a => a.kind === "asset" && ["cash", "stock", "fund", "crypto"].includes(a.type)).reduce((s, a) => s + Number(a.value), 0);
  const lastChange = (latestSavings[0]?.amount || 0) - (latestSavings[1]?.amount || 0);
  const debtRatio = t.assets ? t.liabilities / t.assets : 0;
  const liquidityRatio = t.assets ? liquid / t.assets : 0;
  const score = Math.max(0, Math.min(100, Math.round(82 - debtRatio * 40 + liquidityRatio * 18 + (lastChange > 0 ? 6 : 0))));
  const cards = [
    { label: "资产健康分", value: `${score}`, hint: score >= 80 ? "结构稳健，继续保持" : "可继续降低负债或增加流动性" },
    { label: "负债率", value: `${Math.round(debtRatio * 100)}%`, hint: "总负债 / 总资产" },
    { label: "流动资产", value: money(liquid, true), hint: "现金、股票、基金与 Crypto" },
    { label: "储蓄变化", value: `${lastChange >= 0 ? "+" : ""}${money(lastChange, true)}`, hint: `现金储备 ${money(cash, true)}` }
  ];
  document.querySelector("#insightGrid").innerHTML = cards.map(card => `
    <article class="insight-card"><span>${card.label}</span><strong>${card.value}</strong><small>${card.hint}</small></article>
  `).join("");
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
function renderPlanning() {
  renderTrend();
  renderGoals();
  renderBudget();
  renderLoanPlan();
}
function renderTrend() {
  const t = totals();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const rows = mergeById(data.snapshots || [], [{ id: "current", month: currentMonth, assets: t.assets, liabilities: t.liabilities }])
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);
  const nets = rows.map(row => Number(row.assets) - Number(row.liabilities));
  const min = Math.min(...nets, 0);
  const max = Math.max(...nets, 1);
  document.querySelector("#trendChart").innerHTML = rows.map(row => {
    const net = Number(row.assets) - Number(row.liabilities);
    const height = max === min ? 60 : Math.max(12, ((net - min) / (max - min)) * 100);
    return `<i class="trend-bar" style="height:${height}%" data-value="${money(net, true)}"></i>`;
  }).join("");
  document.querySelector("#trendLabels").innerHTML = rows.map(row => `<span>${row.month.slice(5)}</span>`).join("");
}
function currentForGoal(type) {
  const t = totals();
  if (type === "netWorth") return t.net;
  if (type === "cash") return data.accounts.filter(a => a.kind === "asset" && a.type === "cash").reduce((s, a) => s + Number(a.value), 0);
  if (type === "liquid") return data.accounts.filter(a => a.kind === "asset" && ["cash", "stock", "fund", "crypto"].includes(a.type)).reduce((s, a) => s + Number(a.value), 0);
  return 0;
}
function renderGoals() {
  document.querySelector("#goalList").innerHTML = (data.goals || []).map(goal => {
    const current = currentForGoal(goal.currentType);
    const pct = Math.max(0, Math.min(100, goal.target ? current / Number(goal.target) * 100 : 0));
    return `<button class="goal-card" data-edit-goal="${goal.id}">
      <span class="goal-top"><strong>${escapeHtml(goal.name)}</strong><span>${goal.due || "未设期限"}</span></span>
      <span class="progress-track"><i style="width:${pct}%"></i></span>
      <span class="goal-top"><span>${money(current)} / ${money(goal.target)}</span><span>${Math.round(pct)}%</span></span>
    </button>`;
  }).join("") || `<div class="card"><p class="eyebrow">还没有财富目标</p></div>`;
}
function renderBudget() {
  const b = data.budget || {};
  const income = Number(b.monthlyIncome) || 0;
  const fixed = Number(b.fixedExpense) || 0;
  const flex = Number(b.flexExpense) || 0;
  const target = Number(b.savingTarget) || 0;
  const free = income - fixed - flex;
  const rate = income ? Math.round(target / income * 100) : 0;
  document.querySelector("#budgetCard").innerHTML = `<div class="metric-grid">
    <div class="metric-tile"><span>月收入</span><strong>${money(income)}</strong></div>
    <div class="metric-tile"><span>目标储蓄率</span><strong>${rate}%</strong></div>
    <div class="metric-tile"><span>固定支出</span><strong>${money(fixed)}</strong></div>
    <div class="metric-tile"><span>可支配结余</span><strong>${money(free)}</strong></div>
  </div>`;
}
function renderLoanPlan() {
  const p = data.loanPlan || {};
  const principal = Number(p.principal) || 0;
  const rate = Number(p.annualRate) || 0;
  const repayment = Number(p.monthlyRepayment) || 0;
  const offset = Number(p.offsetBalance) || 0;
  const monthlyInterest = Math.max(0, principal - offset) * rate / 100 / 12;
  const principalPaydown = Math.max(0, repayment - monthlyInterest);
  document.querySelector("#loanPlanCard").innerHTML = `<div class="metric-grid">
    <div class="metric-tile"><span>贷款本金</span><strong>${money(principal)}</strong></div>
    <div class="metric-tile"><span>年利率</span><strong>${rate.toFixed(2)}%</strong></div>
    <div class="metric-tile"><span>估算月利息</span><strong>${money(monthlyInterest)}</strong></div>
    <div class="metric-tile"><span>每月还本</span><strong>${money(principalPaydown)}</strong></div>
  </div>`;
}
function renderPrices() {
  const watches = data.priceWatch || [];
  const autoCount = watches.filter(w => w.source === "coingecko").length;
  const lastUpdated = watches.map(w => w.updatedAt).filter(Boolean).sort().pop();
  document.querySelector("#priceSummary").textContent = autoCount
    ? `${autoCount} 个 Crypto 可自动刷新${lastUpdated ? `，最近更新 ${dateTimeLabel(lastUpdated)}` : ""}。`
    : "添加 CoinGecko ID 后即可自动刷新 Crypto 价格。";
  document.querySelector("#priceWatchList").innerHTML = watches.map(w => {
    const total = Number(w.quantity) * Number(w.price);
    const source = w.source === "coingecko" ? `CoinGecko: ${w.coingeckoId}` : "手动价格";
    const change = Number(w.change24h) || 0;
    return `<button class="price-row" data-edit-price-watch="${w.id}">
      <span class="price-symbol">${escapeHtml((w.symbol || "?").slice(0, 4).toUpperCase())}</span>
      <span class="price-copy"><strong>${escapeHtml(w.name)}</strong><span>${source} · 数量 ${Number(w.quantity).toLocaleString("zh-CN")}</span></span>
      <span class="price-value"><strong>${money(total)}</strong><span class="${change >= 0 ? "positive" : "negative"}">${w.source === "coingecko" ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : money(w.price)}</span></span>
    </button>`;
  }).join("") || `<div class="card"><p class="eyebrow">还没有价格追踪</p></div>`;
}
function dateTimeLabel(value) {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
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
function renderSecurityUI() {
  const supported = Boolean(window.PublicKeyCredential && navigator.credentials && window.isSecureContext);
  const status = document.querySelector("#faceIdStatus");
  status.textContent = !supported ? "此浏览器不支持，或当前不是 HTTPS" : biometric.enabled ? "已启用。下次打开会要求 Face ID/设备解锁。" : "未启用";
  document.querySelector("#enableFaceIdButton").classList.toggle("hidden", !supported || biometric.enabled);
  document.querySelector("#disableFaceIdButton").classList.toggle("hidden", !biometric.enabled);
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
  } else if (type === "note") {
    const item = data.notes.find(n => n.id === id) || { title:"", body:"", date:new Date().toISOString().slice(0,10) };
    document.querySelector("#dialogTitle").textContent = id ? "编辑 Note" : "添加 Note";
    fields.innerHTML = `${field("标题", "title", item.title, "text", "required")}<label class="field"><span>内容</span><textarea name="body" required>${escapeHtml(item.body)}</textarea></label>${field("日期", "date", item.date, "date", "required")}`;
  }
  if (type === "goal") {
    const item = data.goals.find(g => g.id === id) || { name:"", target:"", currentType:"netWorth", due:new Date().toISOString().slice(0,7), note:"" };
    document.querySelector("#dialogTitle").textContent = id ? "编辑财富目标" : "添加财富目标";
    fields.innerHTML = `${field("目标名称", "name", item.name, "text", "required")}${field("目标金额", "target", item.target, "number", "min='0' step='0.01' required")}
      <label class="field"><span>跟踪指标</span><select name="currentType"><option value="netWorth" ${item.currentType === "netWorth" ? "selected":""}>净资产</option><option value="cash" ${item.currentType === "cash" ? "selected":""}>现金存款</option><option value="liquid" ${item.currentType === "liquid" ? "selected":""}>流动资产</option></select></label>
      ${field("期限", "due", item.due, "month")}<label class="field"><span>备注</span><textarea name="note">${escapeHtml(item.note || "")}</textarea></label>`;
  }
  if (type === "snapshot") {
    const t = totals();
    const item = data.snapshots.find(s => s.id === id) || { month:new Date().toISOString().slice(0,7), assets:t.assets, liabilities:t.liabilities };
    document.querySelector("#dialogTitle").textContent = id ? "编辑净资产快照" : "记录净资产快照";
    fields.innerHTML = `${field("月份", "month", item.month, "month", "required")}${field("总资产", "assets", item.assets, "number", "min='0' step='0.01' required")}${field("总负债", "liabilities", item.liabilities, "number", "min='0' step='0.01' required")}`;
  }
  if (type === "budget") {
    const item = data.budget;
    deleteBtn.classList.add("hidden");
    document.querySelector("#dialogTitle").textContent = "编辑每月预算";
    fields.innerHTML = `${field("月收入", "monthlyIncome", item.monthlyIncome, "number", "min='0' step='0.01' required")}${field("固定支出", "fixedExpense", item.fixedExpense, "number", "min='0' step='0.01' required")}${field("自由支出", "flexExpense", item.flexExpense, "number", "min='0' step='0.01' required")}${field("目标储蓄", "savingTarget", item.savingTarget, "number", "min='0' step='0.01' required")}`;
  }
  if (type === "loanPlan") {
    const item = data.loanPlan;
    deleteBtn.classList.add("hidden");
    document.querySelector("#dialogTitle").textContent = "编辑房贷测算";
    fields.innerHTML = `${field("贷款本金", "principal", item.principal, "number", "min='0' step='0.01' required")}${field("年利率 %", "annualRate", item.annualRate, "number", "min='0' step='0.01' required")}${field("每月还款", "monthlyRepayment", item.monthlyRepayment, "number", "min='0' step='0.01' required")}${field("Offset / 对冲账户余额", "offsetBalance", item.offsetBalance, "number", "min='0' step='0.01' required")}`;
  }
  if (type === "priceWatch") {
    data.priceWatch = data.priceWatch || [];
    const item = data.priceWatch.find(w => w.id === id) || { accountId:"", name:"", symbol:"", source:"manual", coingeckoId:"", quantity:"", price:"", currency:data.currency, change24h:0, updatedAt:"" };
    const accountOptions = [`<option value="">不关联账户</option>`].concat(data.accounts.filter(a => a.kind === "asset").map(a => `<option value="${a.id}" ${item.accountId === a.id ? "selected":""}>${escapeHtml(a.name)}</option>`)).join("");
    document.querySelector("#dialogTitle").textContent = id ? "编辑价格追踪" : "添加价格追踪";
    fields.innerHTML = `${field("名称", "name", item.name, "text", "required")}${field("代码", "symbol", item.symbol, "text", "required")}
      <label class="field"><span>关联资产账户</span><select name="accountId">${accountOptions}</select></label>
      <label class="field"><span>价格来源</span><select name="source"><option value="manual" ${item.source === "manual" ? "selected":""}>手动价格</option><option value="coingecko" ${item.source === "coingecko" ? "selected":""}>CoinGecko Crypto</option></select></label>
      ${field("CoinGecko ID", "coingeckoId", item.coingeckoId || "", "text", "placeholder='例如 bitcoin, ethereum, solana'")}
      ${field("持仓数量", "quantity", item.quantity, "number", "min='0' step='any' required")}${field("当前单价", "price", item.price, "number", "min='0' step='any' required")}`;
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
function randomBytes(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}
function bytesToBase64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64urlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}
async function enableFaceIdUnlock() {
  if (!window.PublicKeyCredential || !navigator.credentials || !window.isSecureContext) {
    return showToast("需要 HTTPS 浏览器才支持 Face ID 解锁");
  }
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(),
        rp: { name: "小管家" },
        user: {
          id: randomBytes(16),
          name: cloud.session?.user?.email || "little-steward-user",
          displayName: cloud.session?.user?.email || "小管家用户"
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none"
      }
    });
    saveBiometricConfig({ enabled: true, credentialId: bytesToBase64url(credential.rawId) });
    renderSecurityUI();
    showToast("Face ID 解锁已启用");
  } catch (error) {
    showToast(`启用失败：${error.message || error}`);
  }
}
async function unlockWithFaceId() {
  if (!biometric.enabled || !biometric.credentialId) return showLoginReady();
  try {
    setLoginMessage("等待 Face ID 确认...");
    await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(),
        allowCredentials: [{ type: "public-key", id: base64urlToBytes(biometric.credentialId) }],
        userVerification: "required",
        timeout: 60000
      }
    });
    hideLoginScreen();
    showToast("欢迎回来");
  } catch {
    setLoginMessage("Face ID 未完成。你可以重试，或进入设置处理登录。");
    document.querySelector("#faceUnlockButton").classList.remove("hidden");
    document.querySelector("#enterAppButton").classList.remove("hidden");
    document.querySelector("#loginSettingsButton").classList.remove("hidden");
  }
}
function disableFaceIdUnlock() {
  localStorage.removeItem(BIOMETRIC_KEY);
  biometric = { enabled: false, credentialId: "" };
  renderSecurityUI();
  showToast("Face ID 解锁已关闭");
}
function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "little-steward",
    version: "2026.06.17",
    data: normalizeData(data)
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `little-steward-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("备份已导出");
}
async function importData(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const imported = payload.data || payload;
    if (!Array.isArray(imported.accounts) || !Array.isArray(imported.savings) || !Array.isArray(imported.notes)) {
      throw new Error("备份文件格式不正确");
    }
    data = {
      currency: imported.currency || "AUD",
      accounts: imported.accounts,
      savings: imported.savings,
      notes: imported.notes,
      goals: imported.goals,
      budget: imported.budget,
      loanPlan: imported.loanPlan,
      snapshots: imported.snapshots,
      priceWatch: imported.priceWatch
    };
    data = normalizeData(data);
    await persistData("备份已导入");
  } catch (error) {
    showToast(`导入失败：${error.message || error}`);
  } finally {
    document.querySelector("#importDataInput").value = "";
  }
}
async function refreshCryptoPrices() {
  const cryptoWatches = (data.priceWatch || []).filter(w => w.source === "coingecko" && w.coingeckoId);
  if (!cryptoWatches.length) return showToast("没有可刷新的 Crypto 条目");
  const vs = data.currency.toLowerCase();
  const ids = [...new Set(cryptoWatches.map(w => w.coingeckoId.trim().toLowerCase()))].join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=${encodeURIComponent(vs)}&include_24hr_change=true&include_last_updated_at=true`;
  try {
    showToast("正在刷新 Crypto 价格...");
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`CoinGecko ${response.status}`);
    const prices = await response.json();
    data.priceWatch = data.priceWatch.map(watch => {
      if (watch.source !== "coingecko" || !watch.coingeckoId) return watch;
      const key = watch.coingeckoId.trim().toLowerCase();
      const result = prices[key];
      if (!result || result[vs] == null) return watch;
      const updated = {
        ...watch,
        price: Number(result[vs]),
        currency: data.currency,
        change24h: Number(result[`${vs}_24h_change`]) || 0,
        updatedAt: result.last_updated_at ? new Date(result.last_updated_at * 1000).toISOString() : new Date().toISOString()
      };
      updateLinkedAccountValue(updated);
      return updated;
    });
    await persistData("Crypto 价格已刷新");
  } catch (error) {
    showToast(`刷新失败：${error.message || error}`);
  }
}
function setLoginMessage(text) {
  document.querySelector("#loginSubtitle").textContent = text;
}
function hideLoginScreen() {
  document.querySelector("#loginScreen").classList.add("hidden");
}
function showLoginReady() {
  setLoginMessage("你的资产、储蓄和 Notes 已准备好。");
  document.querySelector("#loadingTrack").classList.add("hidden");
  document.querySelector("#enterAppButton").classList.remove("hidden");
  document.querySelector("#loginSettingsButton").classList.remove("hidden");
}
function bootLoginScreen() {
  setTimeout(() => {
    document.querySelector("#loadingTrack").classList.add("hidden");
    if (biometric.enabled) {
      setLoginMessage("已启用 Face ID 快速解锁。");
      document.querySelector("#faceUnlockButton").classList.remove("hidden");
      unlockWithFaceId();
    } else {
      showLoginReady();
    }
  }, 850);
}
function withUserId(rows) {
  const userId = cloud.session.user.id;
  return rows.map(row => ({ ...row, user_id: userId, updated_at: new Date().toISOString() }));
}
function planPayload() {
  return {
    goals: data.goals || [],
    budget: data.budget || seedData.budget,
    loanPlan: data.loanPlan || seedData.loanPlan,
    snapshots: data.snapshots || [],
    priceWatch: data.priceWatch || []
  };
}
function applyPlanPayload(target, payload = {}) {
  return normalizeData({
    ...target,
    goals: payload.goals || target.goals,
    budget: payload.budget || target.budget,
    loanPlan: payload.loanPlan || target.loanPlan,
    snapshots: payload.snapshots || target.snapshots,
    priceWatch: payload.priceWatch || target.priceWatch
  });
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
        notes: mergeById(data.notes, remote.notes),
        goals: mergeById(data.goals, remote.goals || []),
        budget: { ...data.budget, ...(remote.budget || {}) },
        loanPlan: { ...data.loanPlan, ...(remote.loanPlan || {}) },
        snapshots: mergeById(data.snapshots, remote.snapshots || []),
        priceWatch: mergeById(data.priceWatch, remote.priceWatch || [])
      };
      data = normalizeData(data);
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
    await syncPlansToCloud(client, userId);
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
  const remote = {
    currency: settingsRes.data?.currency || data.currency,
    accounts: accountsRes.data || [],
    savings: savingsRes.data || [],
    notes: notesRes.data || []
  };
  const plans = await fetchPlansFromCloud(client);
  return plans ? applyPlanPayload(remote, plans) : normalizeData(remote);
}
async function syncPlansToCloud(client, userId) {
  const { error } = await client.from("little_steward_plans").upsert({
    user_id: userId,
    id: "default",
    payload: planPayload(),
    updated_at: new Date().toISOString()
  });
  if (error && !String(error.message).includes("little_steward_plans")) throw error;
}
async function fetchPlansFromCloud(client) {
  const { data: row, error } = await client.from("little_steward_plans").select("payload").eq("id", "default").maybeSingle();
  if (error) return null;
  return row?.payload || null;
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
        notes: mergeById(data.notes, remote.notes),
        goals: mergeById(data.goals, remote.goals || []),
        budget: { ...data.budget, ...(remote.budget || {}) },
        loanPlan: { ...data.loanPlan, ...(remote.loanPlan || {}) },
        snapshots: mergeById(data.snapshots, remote.snapshots || []),
        priceWatch: mergeById(data.priceWatch, remote.priceWatch || [])
      };
      data = normalizeData(data);
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
function updateLinkedAccountValue(watch) {
  if (!watch.accountId) return;
  const value = Number(watch.quantity) * Number(watch.price);
  data.accounts = data.accounts.map(account => account.id === watch.accountId ? {
    ...account,
    value,
    updated: new Date().toISOString().slice(0, 10)
  } : account);
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
  if (action === "add-goal") openEditor("goal");
  if (action === "add-snapshot") openEditor("snapshot");
  if (action === "edit-budget") openEditor("budget");
  if (action === "edit-loan-plan") openEditor("loanPlan");
  if (action === "add-price-watch") openEditor("priceWatch");
  const account = e.target.closest("[data-edit-account]")?.dataset.editAccount;
  const saving = e.target.closest("[data-edit-saving]")?.dataset.editSaving;
  const note = e.target.closest("[data-edit-note]")?.dataset.editNote;
  const goal = e.target.closest("[data-edit-goal]")?.dataset.editGoal;
  const priceWatch = e.target.closest("[data-edit-price-watch]")?.dataset.editPriceWatch;
  if (account) openEditor("account", account);
  if (saving) openEditor("saving", saving);
  if (note) openEditor("note", note);
  if (goal) openEditor("goal", goal);
  if (priceWatch) openEditor("priceWatch", priceWatch);
});
function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  document.querySelector("#pageTitle").textContent = ({ overviewPage:"我的资产", assetsPage:"资产与负债", savingsPage:"储蓄记录", planningPage:"计划中心", pricesPage:"价格中心", notesPage:"Notes" })[id];
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
  } else if (type === "note") {
    values.id = id || uid("n");
    data.notes = id ? data.notes.map(x => x.id === id ? values : x) : [...data.notes, values];
  }
  if (type === "goal") {
    values.target = Number(values.target);
    values.id = id || uid("g");
    data.goals = id ? data.goals.map(x => x.id === id ? values : x) : [...data.goals, values];
  }
  if (type === "snapshot") {
    values.assets = Number(values.assets);
    values.liabilities = Number(values.liabilities);
    values.id = id || uid("p");
    data.snapshots = id ? data.snapshots.map(x => x.id === id ? values : x) : [...data.snapshots, values];
  }
  if (type === "budget") {
    data.budget = {
      monthlyIncome: Number(values.monthlyIncome),
      fixedExpense: Number(values.fixedExpense),
      flexExpense: Number(values.flexExpense),
      savingTarget: Number(values.savingTarget)
    };
  }
  if (type === "loanPlan") {
    data.loanPlan = {
      principal: Number(values.principal),
      annualRate: Number(values.annualRate),
      monthlyRepayment: Number(values.monthlyRepayment),
      offsetBalance: Number(values.offsetBalance)
    };
  }
  if (type === "priceWatch") {
    values.quantity = Number(values.quantity);
    values.price = Number(values.price);
    values.change24h = Number(values.change24h) || 0;
    values.currency = data.currency;
    values.updatedAt = new Date().toISOString();
    values.id = id || uid("w");
    data.priceWatch = data.priceWatch || [];
    data.priceWatch = id ? data.priceWatch.map(x => x.id === id ? { ...x, ...values } : x) : [...data.priceWatch, values];
    updateLinkedAccountValue(values);
  }
  document.querySelector("#editorDialog").close();
  await persistData("已保存");
};
document.querySelector("#deleteButton").onclick = async () => {
  const { type, id } = editorState;
  if (type === "account") data.accounts = data.accounts.filter(x => x.id !== id);
  if (type === "saving") data.savings = data.savings.filter(x => x.id !== id);
  if (type === "note") data.notes = data.notes.filter(x => x.id !== id);
  if (type === "goal") data.goals = data.goals.filter(x => x.id !== id);
  if (type === "snapshot") data.snapshots = data.snapshots.filter(x => x.id !== id);
  if (type === "priceWatch") data.priceWatch = data.priceWatch.filter(x => x.id !== id);
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
document.querySelector("#refreshPricesButton").onclick = refreshCryptoPrices;
document.querySelector("#enableFaceIdButton").onclick = enableFaceIdUnlock;
document.querySelector("#disableFaceIdButton").onclick = disableFaceIdUnlock;
document.querySelector("#exportDataButton").onclick = exportData;
document.querySelector("#importDataInput").onchange = e => importData(e.target.files[0]);
document.querySelector("#faceUnlockButton").onclick = unlockWithFaceId;
document.querySelector("#enterAppButton").onclick = hideLoginScreen;
document.querySelector("#loginSettingsButton").onclick = () => {
  hideLoginScreen();
  document.querySelector("#settingsDialog").showModal();
};

document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("zh-CN", { month:"long", day:"numeric", weekday:"long" }).format(new Date());
document.querySelector("#currencySelect").value = data.currency;
render();
initCloud();
bootLoginScreen();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(registration => {
    if (registration.waiting) registration.waiting.postMessage("SKIP_WAITING");
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (worker) worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          worker.postMessage("SKIP_WAITING");
        }
      });
    });
  }).catch(() => {});
}
