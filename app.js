const STORAGE_KEY = "little-steward-v1";
const SUPABASE_CONFIG_KEY = "little-steward-supabase-config";
const BIOMETRIC_KEY = "little-steward-biometric";
const ENCRYPTION_KEY = "little-steward-encryption";
const MARKET_CONFIG_KEY = "little-steward-market-config";
const LANGUAGE_KEY = "little-steward-language";
const LAST_EMAIL_KEY = "little-steward-last-email";
const DEFAULT_ALPHA_VANTAGE_KEY = "SYC96IVAMPXH47F9";
const DEFAULT_FINNHUB_TOKEN = "";
const colors = ["#4b73e8", "#ea8a3c", "#8671df", "#1f9d68", "#e2799c", "#575a63"];
const icons = { property: "⌂", cash: "$", stock: "↗", fund: "F", crypto: "₿", loan: "−", other: "•" };
const typeLabels = {
  zh: { property: "房产", cash: "现金存款", stock: "股票", fund: "基金", crypto: "Crypto", loan: "贷款", other: "其他" },
  en: { property: "Property", cash: "Cash", stock: "Stocks", fund: "Funds", crypto: "Crypto", loan: "Loans", other: "Other" }
};
const labels = typeLabels.zh;
const marketSymbols = [
  ["AAPL", "Apple"], ["MSFT", "Microsoft"], ["NVDA", "Nvidia"], ["TSLA", "Tesla"], ["GOOGL", "Alphabet"], ["AMZN", "Amazon"], ["META", "Meta"],
  ["VOO", "Vanguard S&P 500 ETF"], ["VTI", "Vanguard Total Stock Market ETF"], ["QQQ", "Nasdaq 100 ETF"], ["IVV", "iShares S&P 500 ETF"], ["SPY", "SPDR S&P 500 ETF"]
];
const i18n = {
  zh: {
    appName: "小管家", appTitle: "小管家 · 资产与储蓄", version: "版本：2026.06.18 登录链接增强",
    welcome: "欢迎回来", waking: "正在唤醒你的小管家...", faceUnlock: "使用 Face ID 解锁", enterApp: "进入小管家", loginSettings: "设置 Supabase 登录",
    pageOverview: "我的资产", pageAssets: "资产与负债", pageSavings: "储蓄记录", pagePlanning: "计划中心", pagePrices: "价格中心", pageNotes: "Notes",
    notSignedIn: "未登录", cloudPending: "等待登录", cloudSignedIn: "已登录", syncingShort: "同步中",
    netWorth: "净资产", monthlyChange: "最近储蓄变化", totalAssets: "总资产", totalLiabilities: "总负债",
    wealthDistribution: "财富分布", portfolio: "资产组合", add: "添加", recentUpdates: "最近更新", myAccounts: "我的账户", viewAll: "查看全部",
    all: "全部", assets: "资产", liabilities: "负债", addAsset: "＋ 添加资产或负债", yearlySaved: "今年已储蓄", monthEnd: "月末记录", savingsBalance: "储蓄账户余额", record: "记录", addSaving: "＋ 记录本月余额",
    timeline: "净资产趋势", goals: "财富目标", budget: "每月预算", mortgage: "房贷测算", edit: "编辑", addSnapshot: "记录快照",
    marketSync: "Market Sync", priceTracking: "价格追踪", priceSummaryStatic: "管理股票、基金和 Crypto 的持仓价格。", refreshPrices: "刷新价格", watchlist: "Watchlist", holdingsPrice: "持仓价格", addPrice: "＋ 添加价格追踪",
    notesEyebrow: "财务随手记", notesIntro: "记下重要决定，<br>也记下生活。", navOverview: "总览", navAssets: "资产", navSavings: "储蓄", navPlanning: "计划", navPrices: "价格",
    settings: "设置", done: "完成", displayCurrency: "显示货币", language: "语言", cloudSync: "Supabase 云同步", sync: "同步", saveSupabase: "保存 Supabase 配置", testSupabase: "测试 Supabase 连接", loginEmail: "登录邮箱", sendLoginLink: "发送登录链接", loginLinkHelp: "更稳的手机登录方式：收到邮件后不要先点开链接，长按复制完整登录链接，回到这里粘贴并完成此设备登录。", loginLinkLabel: "粘贴登录链接", emailOtpLabel: "邮箱验证码 / Token（可选）", completeLoginLink: "用此链接在本机登录", checkDeviceLogin: "检查此设备登录状态", pullCloud: "从云端恢复到本机", signOut: "退出登录",
    faceId: "Face ID 快速解锁", enableFaceId: "启用 Face ID 解锁", disableFaceId: "关闭 Face ID 解锁", marketApi: "行情 API", saveMarket: "保存行情设置", encryption: "云端数据加密", passphrase: "加密密码", enableEncryption: "启用加密并同步", unlockEncryption: "解锁加密数据", disableEncryption: "关闭本机加密设置", localSave: "本地保存", localSaveHint: "数据仅保存在这台设备", backup: "数据备份", backupHint: "导出 JSON 作为 Supabase 之外的第二保险", exportBackup: "导出备份 JSON", importBackup: "导入备份 JSON", reset: "恢复示例数据",
    cloudUnconfigured: "未配置", cloudReady: "已配置，等待登录", cloudSyncing: "正在同步...", cloudReadySync: "此设备已登录并可同步", signedInAs: "此设备已登录：{email}", configuredHint: "配置保存后，可以先测试连接。",
    notConfiguredFinnhub: "未配置 Finnhub，{fx}。", configuredFinnhub: "Finnhub 已配置，{fx}。", fxPending: "汇率待刷新",
    healthScore: "资产健康分", healthGood: "结构稳健，继续保持", healthImprove: "可继续降低负债或增加流动性", debtRatio: "负债率", debtHint: "总负债 / 总资产", liquidAssets: "流动资产", liquidHint: "现金、股票、基金与 Crypto", savingsChange: "储蓄变化", cashReserve: "现金储备",
    updated: "更新", emptyRecords: "这里还没有记录", firstSaving: "记录第一个月末余额吧", noNotes: "还没有 Notes", firstNote: "记下你的第一个财务决定。", noGoals: "还没有财富目标", noPrices: "还没有价格追踪",
    autoPrices: "{count} 个价格可自动刷新{updated}。", lastUpdated: "，最近更新 {time}", autoPriceHint: "添加 CoinGecko ID 或 Finnhub 股票代码后即可自动刷新。", linkedHolding: "已关联持仓", watchOnly: "未持仓", quantity: "数量", pendingRefresh: "◇ 待刷新", manualPrice: "手动价格",
    cancel: "取消", save: "保存", deleteRecord: "删除此记录"
  },
  en: {
    appName: "Little Steward", appTitle: "Little Steward · Assets & Savings", version: "Version: 2026.06.18 Stronger login links",
    welcome: "Welcome Back", waking: "Waking up your Little Steward...", faceUnlock: "Unlock with Face ID", enterApp: "Enter Little Steward", loginSettings: "Set up Supabase login",
    pageOverview: "My Assets", pageAssets: "Assets & Liabilities", pageSavings: "Savings Records", pagePlanning: "Planning", pagePrices: "Prices", pageNotes: "Notes",
    notSignedIn: "Not signed in", cloudPending: "Login pending", cloudSignedIn: "Signed in", syncingShort: "Syncing",
    netWorth: "Net Worth", monthlyChange: "Latest savings change", totalAssets: "Total Assets", totalLiabilities: "Total Liabilities",
    wealthDistribution: "Wealth Mix", portfolio: "Portfolio", add: "Add", recentUpdates: "Recent Updates", myAccounts: "My Accounts", viewAll: "View All",
    all: "All", assets: "Assets", liabilities: "Liabilities", addAsset: "+ Add asset or liability", yearlySaved: "Saved This Year", monthEnd: "Month-End", savingsBalance: "Savings Balance", record: "Record", addSaving: "+ Record month-end balance",
    timeline: "Net Worth Timeline", goals: "Wealth Goals", budget: "Monthly Budget", mortgage: "Mortgage Planner", edit: "Edit", addSnapshot: "Add Snapshot",
    marketSync: "Market Sync", priceTracking: "Price Tracking", priceSummaryStatic: "Track holding prices for stocks, funds, and crypto.", refreshPrices: "Refresh Prices", watchlist: "Watchlist", holdingsPrice: "Holding Prices", addPrice: "+ Add price watch",
    notesEyebrow: "Finance Notes", notesIntro: "Capture key decisions,<br>and the life around them.", navOverview: "Home", navAssets: "Assets", navSavings: "Savings", navPlanning: "Plan", navPrices: "Prices",
    settings: "Settings", done: "Done", displayCurrency: "Display Currency", language: "Language", cloudSync: "Supabase Cloud Sync", sync: "Sync", saveSupabase: "Save Supabase Config", testSupabase: "Test Supabase Connection", loginEmail: "Login Email", sendLoginLink: "Send Login Link", loginLinkHelp: "More reliable phone login: when the email arrives, do not open the link first. Long-press and copy the full login link, paste it here, then finish login on this device.", loginLinkLabel: "Paste login link", emailOtpLabel: "Email code / token (optional)", completeLoginLink: "Log in on this device with link", checkDeviceLogin: "Check this device login", pullCloud: "Restore From Cloud", signOut: "Sign Out",
    faceId: "Face ID Quick Unlock", enableFaceId: "Enable Face ID Unlock", disableFaceId: "Disable Face ID Unlock", marketApi: "Market API", saveMarket: "Save Market Settings", encryption: "Cloud Data Encryption", passphrase: "Encryption Password", enableEncryption: "Enable Encryption & Sync", unlockEncryption: "Unlock Encrypted Data", disableEncryption: "Disable Local Encryption", localSave: "Local Save", localSaveHint: "Data is also kept on this device", backup: "Data Backup", backupHint: "Export JSON as a second safety net outside Supabase", exportBackup: "Export Backup JSON", importBackup: "Import Backup JSON", reset: "Restore Demo Data",
    cloudUnconfigured: "Not configured", cloudReady: "Configured, waiting for login", cloudSyncing: "Syncing...", cloudReadySync: "This device is signed in and ready to sync", signedInAs: "This device is signed in: {email}", configuredHint: "After saving config, test the connection first.",
    notConfiguredFinnhub: "Finnhub not configured, {fx}.", configuredFinnhub: "Finnhub configured, {fx}.", fxPending: "FX pending",
    healthScore: "Health Score", healthGood: "Structure looks solid. Keep going.", healthImprove: "Consider lowering debt or adding liquidity.", debtRatio: "Debt Ratio", debtHint: "Total liabilities / total assets", liquidAssets: "Liquid Assets", liquidHint: "Cash, stocks, funds, and crypto", savingsChange: "Savings Change", cashReserve: "Cash reserve",
    updated: "updated", emptyRecords: "No records yet", firstSaving: "Record your first month-end balance", noNotes: "No Notes Yet", firstNote: "Write down your first financial decision.", noGoals: "No wealth goals yet", noPrices: "No price watches yet",
    autoPrices: "{count} prices can auto-refresh{updated}.", lastUpdated: ", last updated {time}", autoPriceHint: "Add a CoinGecko ID or Finnhub stock symbol to enable auto-refresh.", linkedHolding: "Linked holding", watchOnly: "Watch only", quantity: "Qty", pendingRefresh: "◇ Pending", manualPrice: "Manual price",
    cancel: "Cancel", save: "Save", deleteRecord: "Delete this record"
  }
};

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
    { id: "w1", accountId: "a6", name: "Bitcoin", symbol: "BTC", source: "coingecko", coingeckoId: "bitcoin", quantity: 0.32, price: 115000, currency: "AUD", quoteCurrency: "AUD", change24h: 0, updatedAt: "" },
    { id: "w2", accountId: "a4", name: "Apple", symbol: "AAPL", source: "finnhub", coingeckoId: "", quantity: 20, price: 195, currency: "USD", quoteCurrency: "USD", change24h: 0, updatedAt: "" },
    { id: "w3", accountId: "", name: "Vanguard ETF Watch", symbol: "VTI", source: "finnhub", coingeckoId: "", quantity: 0, price: 0, currency: "USD", quoteCurrency: "USD", change24h: 0, updatedAt: "" }
  ]
};

let data = loadData();
let privacy = false;
let activeFilter = "all";
let editorState = null;
let language = loadLanguage();
let cloud = {
  client: null,
  session: null,
  syncing: false,
  config: loadSupabaseConfig(),
  diagnostic: tr("configuredHint"),
  diagnosticType: ""
};
let localDataExists = Boolean(localStorage.getItem(STORAGE_KEY));
let biometric = loadBiometricConfig();
let encryption = loadEncryptionConfig();
let vaultKey = null;
let marketConfig = loadMarketConfig();

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
function loadEncryptionConfig() {
  try { return JSON.parse(localStorage.getItem(ENCRYPTION_KEY)) || { enabled: false, salt: "" }; }
  catch { return { enabled: false, salt: "" }; }
}
function saveEncryptionConfig(config) {
  encryption = config;
  localStorage.setItem(ENCRYPTION_KEY, JSON.stringify(config));
}
function loadMarketConfig() {
  try { return normalizeMarketConfig(JSON.parse(localStorage.getItem(MARKET_CONFIG_KEY)) || {}); }
  catch { return normalizeMarketConfig({}); }
}
function loadLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  return saved === "en" ? "en" : "zh";
}
function tr(key, vars = {}) {
  const template = i18n[language]?.[key] || i18n.zh[key] || key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}
function currentLocale() {
  return language === "en" ? "en-US" : "zh-CN";
}
function typeLabel(type) {
  return typeLabels[language]?.[type] || typeLabels.zh[type] || type;
}
function normalizeMarketConfig(config) {
  return {
    alphaVantageKey: config.alphaVantageKey || DEFAULT_ALPHA_VANTAGE_KEY,
    finnhubToken: config.finnhubToken || DEFAULT_FINNHUB_TOKEN,
    fxRates: config.fxRates || { "USD_AUD": 1.52, "AUD_USD": 0.66 },
    fxUpdatedAt: config.fxUpdatedAt || ""
  };
}
function saveMarketConfig(config) {
  marketConfig = normalizeMarketConfig(config);
  localStorage.setItem(MARKET_CONFIG_KEY, JSON.stringify(config));
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
  return moneyInCurrency(value, data.currency, compact);
}
function moneyInCurrency(value, currency = data.currency, compact = false) {
  if (privacy) return "••••••";
  return new Intl.NumberFormat(currentLocale(), {
    style: "currency", currency, maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard"
  }).format(value);
}
function totals() {
  const assets = data.accounts.filter(a => a.kind === "asset").reduce((s, a) => s + Number(a.value), 0);
  const liabilities = data.accounts.filter(a => a.kind === "liability").reduce((s, a) => s + Number(a.value), 0);
  return { assets, liabilities, net: assets - liabilities };
}
function dateLabel(date) {
  return new Intl.DateTimeFormat(currentLocale(), { month: "short", day: "numeric" }).format(new Date(date + "T12:00:00"));
}
function monthLabel(month) {
  return new Intl.DateTimeFormat(currentLocale(), { year: "numeric", month: "long" }).format(new Date(month + "-01T12:00:00"));
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
function setText(selector, key) {
  const el = document.querySelector(selector);
  if (el) el.textContent = tr(key);
}
function applyStaticLanguage() {
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = tr("appTitle");
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute("content", tr("appName"));
  document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat(currentLocale(), { month:"long", day:"numeric", weekday:"long" }).format(new Date());
  const loginSubtitle = document.querySelector("#loginSubtitle");
  if (loginSubtitle && !document.querySelector("#loadingTrack").classList.contains("hidden")) loginSubtitle.textContent = tr("waking");
  document.querySelector("#languageSelect").value = language;
  document.querySelector("#currencySelect").value = data.currency;
  const activePage = document.querySelector(".bottom-nav button.active")?.dataset.page || "overviewPage";
  document.querySelector("#pageTitle").textContent = pageTitle(activePage);
  const textMap = [
    ["#faceUnlockButton", "faceUnlock"], ["#enterAppButton", "enterApp"], ["#loginSettingsButton", "loginSettings"],
    [".hero-topline span", "netWorth"], [".hero-grid div:first-child span", "totalAssets"], [".hero-grid div:last-child span", "totalLiabilities"],
    ["#overviewPage .section-heading:nth-of-type(1) .eyebrow", "wealthDistribution"], ["#overviewPage .section-heading:nth-of-type(1) h2", "portfolio"], ["#overviewPage .section-heading:nth-of-type(1) button", "add"],
    ["#overviewPage .section-heading:nth-of-type(2) .eyebrow", "recentUpdates"], ["#overviewPage .section-heading:nth-of-type(2) h2", "myAccounts"], ["#overviewPage .section-heading:nth-of-type(2) button", "viewAll"],
    ["#assetSegment button[data-filter='all']", "all"], ["#assetSegment button[data-filter='asset']", "assets"], ["#assetSegment button[data-filter='liability']", "liabilities"],
    ["#assetsPage .summary-strip span", "netWorth"], ["#assetsPage .primary-button", "addAsset"],
    ["#savingsPage .savings-hero .eyebrow", "yearlySaved"], ["#savingsPage .section-heading .eyebrow", "monthEnd"], ["#savingsPage .section-heading h2", "savingsBalance"], ["#savingsPage .section-heading button", "record"], ["#savingsPage .primary-button", "addSaving"],
    ["#planningPage .trend-card .eyebrow", "timeline"], ["#planningPage .trend-card h2", "timeline"], ["#planningPage .trend-card button", "addSnapshot"],
    ["#planningPage .section-heading:nth-of-type(1) .eyebrow", "goals"], ["#planningPage .section-heading:nth-of-type(1) h2", "goals"], ["#planningPage .section-heading:nth-of-type(1) button", "add"],
    ["#planningPage .section-heading:nth-of-type(2) .eyebrow", "budget"], ["#planningPage .section-heading:nth-of-type(2) h2", "budget"], ["#planningPage .section-heading:nth-of-type(2) button", "edit"],
    ["#planningPage .section-heading:nth-of-type(3) .eyebrow", "mortgage"], ["#planningPage .section-heading:nth-of-type(3) h2", "mortgage"], ["#planningPage .section-heading:nth-of-type(3) button", "edit"],
    ["#pricesPage .price-hero .eyebrow", "marketSync"], ["#pricesPage .price-hero h2", "priceTracking"], ["#refreshPricesButton", "refreshPrices"], ["#pricesPage .section-heading .eyebrow", "watchlist"], ["#pricesPage .section-heading h2", "holdingsPrice"], ["#pricesPage .section-heading button", "add"], ["#pricesPage > .primary-button", "addPrice"],
    ["#notesPage .notes-intro .eyebrow", "notesEyebrow"], [".bottom-nav button[data-page='overviewPage']", "navOverview"], [".bottom-nav button[data-page='assetsPage']", "navAssets"], [".bottom-nav button[data-page='savingsPage']", "navSavings"], [".bottom-nav button[data-page='planningPage']", "navPlanning"], [".bottom-nav button[data-page='pricesPage']", "navPrices"],
    ["#settingsDialog .dialog-header h3", "settings"], ["#closeSettings", "done"], [".app-version", "version"], ["#languageLabel", "language"],
    ["#saveSupabaseConfig", "saveSupabase"], ["#testSupabaseConnection", "testSupabase"], ["#sendLoginLink", "sendLoginLink"], ["#loginLinkHelp", "loginLinkHelp"], ["#loginLinkLabel", "loginLinkLabel"], ["#emailOtpLabel", "emailOtpLabel"], ["#completeLoginLinkButton", "completeLoginLink"], ["#checkDeviceLoginButton", "checkDeviceLogin"], ["#checkSignedInDeviceButton", "checkDeviceLogin"], ["#pullCloudButton", "pullCloud"], ["#signOutButton", "signOut"],
    ["#enableFaceIdButton", "enableFaceId"], ["#disableFaceIdButton", "disableFaceId"], ["#saveMarketConfigButton", "saveMarket"], ["#enableEncryptionButton", "enableEncryption"], ["#unlockEncryptionButton", "unlockEncryption"], ["#disableEncryptionButton", "disableEncryption"],
    ["#exportDataButton", "exportBackup"], ["#importBackupText", "importBackup"], ["#resetData", "reset"], ["#cancelDialog", "cancel"], ["#editorForm button[type='submit']", "save"], ["#deleteButton", "deleteRecord"],
    [".login-card h2", "welcome"]
  ];
  textMap.forEach(([selector, key]) => setText(selector, key));
  const setHeading = (root, index, eyebrowKey, titleKey, buttonKey) => {
    const heading = document.querySelectorAll(`${root} .section-heading`)[index];
    if (!heading) return;
    const eyebrow = heading.querySelector(".eyebrow");
    const title = heading.querySelector("h2");
    const button = heading.querySelector("button");
    if (eyebrow) eyebrow.textContent = tr(eyebrowKey);
    if (title) title.textContent = tr(titleKey);
    if (button && buttonKey) button.textContent = tr(buttonKey);
  };
  setHeading("#overviewPage", 0, "wealthDistribution", "portfolio", "add");
  setHeading("#overviewPage", 1, "recentUpdates", "myAccounts", "viewAll");
  setHeading("#savingsPage", 0, "monthEnd", "savingsBalance", "record");
  setHeading("#planningPage", 0, "goals", "goals", "add");
  setHeading("#planningPage", 1, "budget", "budget", "edit");
  setHeading("#planningPage", 2, "mortgage", "mortgage", "edit");
  setHeading("#pricesPage", 0, "watchlist", "holdingsPrice", "add");
  document.querySelector(".notes-intro h2").innerHTML = tr("notesIntro");
  const navIcons = { overviewPage: "⌂", assetsPage: "▦", savingsPage: "↗", planningPage: "◎", pricesPage: "$" };
  document.querySelectorAll(".bottom-nav button").forEach(button => {
    const page = button.dataset.page;
    button.innerHTML = `<span>${navIcons[page]}</span>${tr({ overviewPage:"navOverview", assetsPage:"navAssets", savingsPage:"navSavings", planningPage:"navPlanning", pricesPage:"navPrices" }[page])}`;
  });
  document.querySelectorAll(".field > span").forEach(span => {
    const text = span.textContent.trim();
    const replacements = {
      "显示货币": tr("displayCurrency"), "Display Currency": tr("displayCurrency"),
      "语言": tr("language"), "Language": tr("language"),
      "登录邮箱": tr("loginEmail"), "Login Email": tr("loginEmail"),
      "加密密码": tr("passphrase"), "Encryption Password": tr("passphrase")
    };
    if (replacements[text]) span.textContent = replacements[text];
  });
  document.querySelector(".cloud-header strong").textContent = tr("cloudSync");
  document.querySelector("#syncNowButton").textContent = tr("sync");
  document.querySelector(".security-panel strong").textContent = tr("faceId");
  document.querySelector(".market-panel strong").textContent = tr("marketApi");
  document.querySelector(".encryption-panel strong").textContent = tr("encryption");
  const rows = document.querySelectorAll(".settings-row div, .backup-panel div");
  if (rows[0]) rows[0].innerHTML = `<strong>${tr("localSave")}</strong><span>${tr("localSaveHint")}</span>`;
  if (rows[1]) rows[1].innerHTML = `<strong>${tr("backup")}</strong><span>${tr("backupHint")}</span>`;
  updateCloudLoginChip();
}
function pageTitle(id) {
  return ({ overviewPage: tr("pageOverview"), assetsPage: tr("pageAssets"), savingsPage: tr("pageSavings"), planningPage: tr("pagePlanning"), pricesPage: tr("pagePrices"), notesPage: tr("pageNotes") })[id] || tr("pageOverview");
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
  document.querySelector("#netChange").textContent = `${tr("monthlyChange")} ${change >= 0 ? "+" : ""}${money(change)}`;
  renderAllocation();
  renderInsights(t);
  renderAccounts();
  renderSavings();
  renderPlanning();
  renderPrices();
  renderNotes();
  renderCloudUI();
  renderSecurityUI();
  renderMarketUI();
  renderEncryptionUI();
  applyStaticLanguage();
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
  document.querySelector("#assetCount").dataset.label = language === "en" ? "assets" : "项资产";
  document.querySelector("#allocationLegend").innerHTML = grouped.slice(0, 5).map(([type, value], i) => `
    <div class="legend-row"><i class="legend-dot" style="background:${colors[i % colors.length]}"></i><span>${typeLabel(type)}</span><strong>${money(value, true)}</strong></div>
  `).join("") || `<p class="eyebrow">${tr("emptyRecords")}</p>`;
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
    { label: tr("healthScore"), value: `${score}`, hint: score >= 80 ? tr("healthGood") : tr("healthImprove") },
    { label: tr("debtRatio"), value: `${Math.round(debtRatio * 100)}%`, hint: tr("debtHint") },
    { label: tr("liquidAssets"), value: money(liquid, true), hint: tr("liquidHint") },
    { label: tr("savingsChange"), value: `${lastChange >= 0 ? "+" : ""}${money(lastChange, true)}`, hint: `${tr("cashReserve")} ${money(cash, true)}` }
  ];
  document.querySelector("#insightGrid").innerHTML = cards.map(card => `
    <article class="insight-card"><span>${card.label}</span><strong>${card.value}</strong><small>${card.hint}</small></article>
  `).join("");
}

function accountRow(a, i) {
  return `<button class="account-row" data-edit-account="${a.id}">
    <span class="account-icon" style="background:${a.kind === "liability" ? "#d95050" : colors[i % colors.length]}">${icons[a.type] || "•"}</span>
    <span class="account-copy"><strong>${escapeHtml(a.name)}</strong><span>${escapeHtml(a.note || typeLabel(a.type))}</span></span>
    <span class="account-value"><strong class="${a.kind === "liability" ? "liability-amount" : ""}">${a.kind === "liability" ? "−" : ""}${money(a.value)}</strong><span>${dateLabel(a.updated)} ${tr("updated")}</span></span>
  </button>`;
}
function renderAccounts() {
  const recent = [...data.accounts].sort((a,b) => b.updated.localeCompare(a.updated)).slice(0, 4);
  document.querySelector("#recentAccounts").innerHTML = recent.map(accountRow).join("");
  const filtered = data.accounts.filter(a => activeFilter === "all" || a.kind === activeFilter);
  document.querySelector("#allAccounts").innerHTML = filtered.map(accountRow).join("") || `<div class="card"><p class="eyebrow">${tr("emptyRecords")}</p></div>`;
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
    </button>`).join("") || `<div class="card"><p class="eyebrow">${tr("firstSaving")}</p></div>`;
}
function renderNotes() {
  document.querySelector("#notesGrid").innerHTML = [...data.notes].sort((a,b) => b.date.localeCompare(a.date)).map(n => `
    <button class="note-card" data-edit-note="${n.id}"><span>${dateLabel(n.date)}</span><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.body)}</p></button>
  `).join("") || `<div class="note-card"><h3>${tr("noNotes")}</h3><p>${tr("firstNote")}</p></div>`;
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
      <span class="goal-top"><strong>${escapeHtml(goal.name)}</strong><span>${goal.due || (language === "en" ? "No deadline" : "未设期限")}</span></span>
      <span class="progress-track"><i style="width:${pct}%"></i></span>
      <span class="goal-top"><span>${money(current)} / ${money(goal.target)}</span><span>${Math.round(pct)}%</span></span>
    </button>`;
  }).join("") || `<div class="card"><p class="eyebrow">${tr("noGoals")}</p></div>`;
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
    <div class="metric-tile"><span>${language === "en" ? "Monthly income" : "月收入"}</span><strong>${money(income)}</strong></div>
    <div class="metric-tile"><span>${language === "en" ? "Target saving rate" : "目标储蓄率"}</span><strong>${rate}%</strong></div>
    <div class="metric-tile"><span>${language === "en" ? "Fixed expenses" : "固定支出"}</span><strong>${money(fixed)}</strong></div>
    <div class="metric-tile"><span>${language === "en" ? "Free cash flow" : "可支配结余"}</span><strong>${money(free)}</strong></div>
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
    <div class="metric-tile"><span>${language === "en" ? "Loan principal" : "贷款本金"}</span><strong>${money(principal)}</strong></div>
    <div class="metric-tile"><span>${language === "en" ? "Annual rate" : "年利率"}</span><strong>${rate.toFixed(2)}%</strong></div>
    <div class="metric-tile"><span>${language === "en" ? "Estimated monthly interest" : "估算月利息"}</span><strong>${money(monthlyInterest)}</strong></div>
    <div class="metric-tile"><span>${language === "en" ? "Monthly principal" : "每月还本"}</span><strong>${money(principalPaydown)}</strong></div>
  </div>`;
}
function renderPrices() {
  const watches = data.priceWatch || [];
  const autoCount = watches.filter(w => ["coingecko", "alphavantage", "finnhub"].includes(w.source)).length;
  const lastUpdated = watches.map(w => w.updatedAt).filter(Boolean).sort().pop();
  document.querySelector("#priceSummary").textContent = autoCount
    ? tr("autoPrices", { count: autoCount, updated: lastUpdated ? tr("lastUpdated", { time: dateTimeLabel(lastUpdated) }) : "" })
    : tr("autoPriceHint");
  document.querySelector("#priceWatchList").innerHTML = watches.map(w => {
    const quoteCurrency = w.quoteCurrency || w.currency || data.currency;
    const total = Number(w.quantity) * Number(w.price);
    const convertedTotal = convertCurrency(total, quoteCurrency, data.currency);
    const source = priceSourceLabel(w);
    const change = Number(w.change24h) || 0;
    const holding = w.accountId ? tr("linkedHolding") : tr("watchOnly");
    const primaryValue = w.accountId ? money(convertedTotal) : moneyInCurrency(Number(w.price) || 0, quoteCurrency);
    const subValue = w.accountId && quoteCurrency !== data.currency ? `${moneyInCurrency(total, quoteCurrency)} → ${money(convertedTotal)}` : moneyInCurrency(Number(w.price) || 0, quoteCurrency);
    const changeBadge = marketChangeBadge(w);
    return `<button class="price-row" data-edit-price-watch="${w.id}">
      <span class="price-symbol">${escapeHtml((w.symbol || "?").slice(0, 4).toUpperCase())}</span>
      <span class="price-copy"><strong>${escapeHtml(w.name)}</strong><span>${source} · ${holding} · ${tr("quantity")} ${Number(w.quantity).toLocaleString(currentLocale())}</span>${changeBadge}</span>
      <span class="price-value"><strong>${primaryValue}</strong><span>${subValue}</span></span>
    </button>`;
  }).join("") || `<div class="card"><p class="eyebrow">${tr("noPrices")}</p></div>`;
}
function marketChangeBadge(w) {
  if (!["coingecko", "alphavantage", "finnhub"].includes(w.source) || !w.updatedAt) {
    return `<em class="change-badge neutral">${tr("pendingRefresh")}</em>`;
  }
  const change = Number(w.change24h) || 0;
  const up = change >= 0;
  return `<em class="change-badge ${up ? "up" : "down"}">${up ? "▲" : "▼"} 24h ${up ? "+" : ""}${change.toFixed(2)}%</em>`;
}
function priceSourceLabel(w) {
  if (w.source === "coingecko") return `CoinGecko: ${w.coingeckoId}`;
  if (w.source === "alphavantage") return `Alpha Vantage: ${w.symbol}`;
  if (w.source === "finnhub") return `Finnhub: ${w.symbol}`;
  return tr("manualPrice");
}
function dateTimeLabel(value) {
  return new Intl.DateTimeFormat(currentLocale(), { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
function convertCurrency(value, fromCurrency = data.currency, toCurrency = data.currency) {
  if (fromCurrency === toCurrency) return Number(value) || 0;
  const direct = marketConfig.fxRates?.[`${fromCurrency}_${toCurrency}`];
  if (direct) return (Number(value) || 0) * Number(direct);
  const reverse = marketConfig.fxRates?.[`${toCurrency}_${fromCurrency}`];
  if (reverse) return (Number(value) || 0) / Number(reverse);
  return Number(value) || 0;
}
function renderCloudUI() {
  const hasConfig = Boolean(cloud.config.url && cloud.config.anonKey);
  const email = cloud.session?.user?.email;
  const status = document.querySelector("#cloudStatus");
  document.querySelector("#supabaseUrlInput").value = cloud.config.url || "";
  document.querySelector("#supabaseAnonInput").value = cloud.config.anonKey || "";
  if (!document.querySelector("#authEmailInput").value) document.querySelector("#authEmailInput").value = localStorage.getItem(LAST_EMAIL_KEY) || "";
  document.querySelector("#authBox").classList.toggle("hidden", !hasConfig || Boolean(email));
  document.querySelector("#signedInBox").classList.toggle("hidden", !email);
  document.querySelector("#syncNowButton").disabled = !email || cloud.syncing;
  document.querySelector("#pullCloudButton").disabled = !email || cloud.syncing;
  document.querySelector("#testSupabaseConnection").disabled = !hasConfig || cloud.syncing;
  document.querySelector("#signedInText").textContent = email ? tr("signedInAs", { email }) : "";
  status.textContent = !hasConfig ? tr("cloudUnconfigured") : email ? (cloud.syncing ? tr("cloudSyncing") : tr("cloudReadySync")) : tr("cloudReady");
  const diagnostic = document.querySelector("#cloudDiagnostic");
  diagnostic.textContent = cloud.diagnostic;
  diagnostic.className = `cloud-diagnostic ${cloud.diagnosticType}`;
  updateCloudLoginChip();
}
function updateCloudLoginChip() {
  const chip = document.querySelector("#cloudLoginChip");
  if (!chip) return;
  const hasConfig = Boolean(cloud.config.url && cloud.config.anonKey);
  const email = cloud.session?.user?.email;
  chip.classList.toggle("signed-in", Boolean(email));
  chip.classList.toggle("pending", hasConfig && !email);
  chip.textContent = email ? `${tr("cloudSignedIn")}: ${email}` : hasConfig ? tr("cloudPending") : tr("notSignedIn");
  chip.title = chip.textContent;
}
function renderSecurityUI() {
  const supported = Boolean(window.PublicKeyCredential && navigator.credentials && window.isSecureContext);
  const status = document.querySelector("#faceIdStatus");
  status.textContent = !supported
    ? (language === "en" ? "This browser is unsupported, or the page is not HTTPS." : "此浏览器不支持，或当前不是 HTTPS")
    : biometric.enabled
      ? (language === "en" ? "Enabled. Next launch will ask for Face ID/device unlock." : "已启用。下次打开会要求 Face ID/设备解锁。")
      : (language === "en" ? "Not enabled" : "未启用");
  document.querySelector("#enableFaceIdButton").classList.toggle("hidden", !supported || biometric.enabled);
  document.querySelector("#disableFaceIdButton").classList.toggle("hidden", !biometric.enabled);
}
function renderMarketUI() {
  document.querySelector("#finnhubTokenInput").value = marketConfig.finnhubToken || "";
  document.querySelector("#alphaVantageKeyInput").value = marketConfig.alphaVantageKey || "";
  const fx = marketConfig.fxRates?.USD_AUD ? `USD/AUD ${Number(marketConfig.fxRates.USD_AUD).toFixed(4)}` : tr("fxPending");
  document.querySelector("#marketStatus").textContent = marketConfig.finnhubToken ? tr("configuredFinnhub", { fx }) : tr("notConfiguredFinnhub", { fx });
}
function renderEncryptionUI() {
  const status = document.querySelector("#encryptionStatus");
  const diagnostic = document.querySelector("#encryptionDiagnostic");
  const enabled = encryption.enabled;
  const unlocked = Boolean(vaultKey);
  status.textContent = enabled
    ? (unlocked
      ? (language === "en" ? "Enabled and unlocked. Cloud sync will write encrypted Vault data." : "已启用并已解锁，云端同步将写入密文 Vault。")
      : (language === "en" ? "Enabled, waiting for your password to unlock." : "已启用，等待输入密码解锁。"))
    : (language === "en" ? "Not enabled" : "未启用");
  document.querySelector("#enableEncryptionButton").classList.toggle("hidden", enabled && unlocked);
  document.querySelector("#unlockEncryptionButton").classList.toggle("hidden", !enabled || unlocked);
  document.querySelector("#disableEncryptionButton").classList.toggle("hidden", !enabled);
  diagnostic.textContent = enabled
    ? (language === "en" ? "When enabled, full data syncs to Supabase Vault as ciphertext. Remember this password." : "启用后，完整数据会以密文同步到 Supabase Vault。请务必记住密码。")
    : (language === "en" ? "The password is never uploaded. If you forget it, the cloud Vault cannot be decrypted." : "密码不会上传。忘记密码将无法解密云端 Vault。");
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
    document.querySelector("#dialogTitle").textContent = id ? (language === "en" ? "Edit Account" : "编辑账户") : (language === "en" ? "Add Asset or Liability" : "添加资产或负债");
    fields.innerHTML = `${field(language === "en" ? "Name" : "名称", "name", item.name, "text", "required")}
      <label class="field"><span>${language === "en" ? "Category" : "类别"}</span><select name="type">${Object.entries(typeLabels[language]).map(([v,l]) => `<option value="${v}" ${item.type === v ? "selected":""}>${l}</option>`).join("")}</select></label>
      <label class="field"><span>${language === "en" ? "Kind" : "性质"}</span><select name="kind"><option value="asset" ${item.kind === "asset" ? "selected":""}>${tr("assets")}</option><option value="liability" ${item.kind === "liability" ? "selected":""}>${tr("liabilities")}</option></select></label>
      ${field(language === "en" ? "Current Value" : "当前价值", "value", item.value, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Note" : "备注", "note", item.note)}${field(language === "en" ? "Updated Date" : "更新日期", "updated", item.updated, "date", "required")}`;
  } else if (type === "saving") {
    const item = data.savings.find(s => s.id === id) || { month:new Date().toISOString().slice(0,7), amount:"", note:"" };
    document.querySelector("#dialogTitle").textContent = id ? (language === "en" ? "Edit Month-End Record" : "编辑月末记录") : (language === "en" ? "Record Month-End Balance" : "记录月末余额");
    fields.innerHTML = `${field(language === "en" ? "Month" : "月份", "month", item.month, "month", "required")}${field(language === "en" ? "Savings + Transaction Balance" : "储蓄与活期余额", "amount", item.amount, "number", "min='0' step='0.01' required")}
      <label class="field"><span>Notes</span><textarea name="note" placeholder="${language === "en" ? "What happened this month?" : "这个月发生了什么？"}">${escapeHtml(item.note)}</textarea></label>`;
  } else if (type === "note") {
    const item = data.notes.find(n => n.id === id) || { title:"", body:"", date:new Date().toISOString().slice(0,10) };
    document.querySelector("#dialogTitle").textContent = id ? (language === "en" ? "Edit Note" : "编辑 Note") : (language === "en" ? "Add Note" : "添加 Note");
    fields.innerHTML = `${field(language === "en" ? "Title" : "标题", "title", item.title, "text", "required")}<label class="field"><span>${language === "en" ? "Body" : "内容"}</span><textarea name="body" required>${escapeHtml(item.body)}</textarea></label>${field(language === "en" ? "Date" : "日期", "date", item.date, "date", "required")}`;
  }
  if (type === "goal") {
    const item = data.goals.find(g => g.id === id) || { name:"", target:"", currentType:"netWorth", due:new Date().toISOString().slice(0,7), note:"" };
    document.querySelector("#dialogTitle").textContent = id ? (language === "en" ? "Edit Goal" : "编辑财富目标") : (language === "en" ? "Add Goal" : "添加财富目标");
    fields.innerHTML = `${field(language === "en" ? "Goal Name" : "目标名称", "name", item.name, "text", "required")}${field(language === "en" ? "Target Amount" : "目标金额", "target", item.target, "number", "min='0' step='0.01' required")}
      <label class="field"><span>${language === "en" ? "Tracking Metric" : "跟踪指标"}</span><select name="currentType"><option value="netWorth" ${item.currentType === "netWorth" ? "selected":""}>${tr("netWorth")}</option><option value="cash" ${item.currentType === "cash" ? "selected":""}>${typeLabel("cash")}</option><option value="liquid" ${item.currentType === "liquid" ? "selected":""}>${tr("liquidAssets")}</option></select></label>
      ${field(language === "en" ? "Due" : "期限", "due", item.due, "month")}<label class="field"><span>${language === "en" ? "Note" : "备注"}</span><textarea name="note">${escapeHtml(item.note || "")}</textarea></label>`;
  }
  if (type === "snapshot") {
    const t = totals();
    const item = data.snapshots.find(s => s.id === id) || { month:new Date().toISOString().slice(0,7), assets:t.assets, liabilities:t.liabilities };
    document.querySelector("#dialogTitle").textContent = id ? (language === "en" ? "Edit Net Worth Snapshot" : "编辑净资产快照") : (language === "en" ? "Record Net Worth Snapshot" : "记录净资产快照");
    fields.innerHTML = `${field(language === "en" ? "Month" : "月份", "month", item.month, "month", "required")}${field(tr("totalAssets"), "assets", item.assets, "number", "min='0' step='0.01' required")}${field(tr("totalLiabilities"), "liabilities", item.liabilities, "number", "min='0' step='0.01' required")}`;
  }
  if (type === "budget") {
    const item = data.budget;
    deleteBtn.classList.add("hidden");
    document.querySelector("#dialogTitle").textContent = language === "en" ? "Edit Monthly Budget" : "编辑每月预算";
    fields.innerHTML = `${field(language === "en" ? "Monthly Income" : "月收入", "monthlyIncome", item.monthlyIncome, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Fixed Expenses" : "固定支出", "fixedExpense", item.fixedExpense, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Flexible Spending" : "自由支出", "flexExpense", item.flexExpense, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Saving Target" : "目标储蓄", "savingTarget", item.savingTarget, "number", "min='0' step='0.01' required")}`;
  }
  if (type === "loanPlan") {
    const item = data.loanPlan;
    deleteBtn.classList.add("hidden");
    document.querySelector("#dialogTitle").textContent = language === "en" ? "Edit Mortgage Planner" : "编辑房贷测算";
    fields.innerHTML = `${field(language === "en" ? "Loan Principal" : "贷款本金", "principal", item.principal, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Annual Rate %" : "年利率 %", "annualRate", item.annualRate, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Monthly Repayment" : "每月还款", "monthlyRepayment", item.monthlyRepayment, "number", "min='0' step='0.01' required")}${field(language === "en" ? "Offset Balance" : "Offset / 对冲账户余额", "offsetBalance", item.offsetBalance, "number", "min='0' step='0.01' required")}`;
  }
  if (type === "priceWatch") {
    data.priceWatch = data.priceWatch || [];
    const item = data.priceWatch.find(w => w.id === id) || { accountId:"", name:"", symbol:"", source:"alphavantage", coingeckoId:"", quantity:"", price:"", currency:"USD", quoteCurrency:"USD", change24h:0, updatedAt:"" };
    const accountOptions = [`<option value="">${language === "en" ? "Do not link account" : "不关联账户"}</option>`].concat(data.accounts.filter(a => a.kind === "asset").map(a => `<option value="${a.id}" ${item.accountId === a.id ? "selected":""}>${escapeHtml(a.name)}</option>`)).join("");
    const symbolOptions = marketSymbols.map(([symbol, name]) => `<option value="${symbol}">${escapeHtml(name)}</option>`).join("");
    document.querySelector("#dialogTitle").textContent = id ? (language === "en" ? "Edit Price Watch" : "编辑价格追踪") : (language === "en" ? "Add Price Watch" : "添加价格追踪");
    fields.innerHTML = `${field(language === "en" ? "Name" : "名称", "name", item.name, "text", "required")}${field(language === "en" ? "Symbol" : "代码", "symbol", item.symbol, "text", `required list='marketSymbolOptions' placeholder='${language === "en" ? "Type or select, e.g. AAPL / VAS.AX" : "输入或从列表选择，例如 AAPL / VAS.AX"}'`)}<datalist id="marketSymbolOptions">${symbolOptions}</datalist>
      <button type="button" class="secondary-button full-width" id="marketSymbolSearchButton">${language === "en" ? "Search symbol suggestions" : "搜索代码建议"}</button><div class="symbol-results" id="marketSymbolResults"></div>
      <label class="field"><span>${language === "en" ? "Linked Asset Account" : "关联资产账户"}</span><select name="accountId">${accountOptions}</select></label>
      <label class="field"><span>${language === "en" ? "Price Source" : "价格来源"}</span><select name="source"><option value="manual" ${item.source === "manual" ? "selected":""}>${tr("manualPrice")}</option><option value="coingecko" ${item.source === "coingecko" ? "selected":""}>CoinGecko Crypto</option><option value="finnhub" ${item.source === "finnhub" ? "selected":""}>Finnhub ${language === "en" ? "Stocks/ETF" : "股票/ETF"}</option><option value="alphavantage" ${item.source === "alphavantage" ? "selected":""}>Alpha Vantage ${language === "en" ? "Stocks/ETF/Funds" : "股票/ETF/基金"}</option></select></label>
      <label class="field"><span>${language === "en" ? "Quote Currency" : "报价币种"}</span><select name="quoteCurrency"><option value="USD" ${(item.quoteCurrency || item.currency) === "USD" ? "selected":""}>USD ${language === "en" ? "Dollar" : "美元"}</option><option value="AUD" ${(item.quoteCurrency || item.currency) === "AUD" ? "selected":""}>AUD ${language === "en" ? "Dollar" : "澳元"}</option><option value="CNY" ${(item.quoteCurrency || item.currency) === "CNY" ? "selected":""}>CNY ${language === "en" ? "Yuan" : "人民币"}</option></select></label>
      ${field("CoinGecko ID", "coingeckoId", item.coingeckoId || "", "text", `placeholder='${language === "en" ? "Crypto: bitcoin / ethereum; stocks can stay blank" : "Crypto 填 bitcoin / ethereum；股票可留空"}'`)}
      ${field(language === "en" ? "Holding Quantity" : "持仓数量", "quantity", item.quantity, "number", `min='0' step='any' placeholder='${language === "en" ? "Use 0 for watch only" : "未持仓可填 0"}'`)}${field(language === "en" ? "Current Unit Price" : "当前单价", "price", item.price, "number", `min='0' step='any' placeholder='${language === "en" ? "Can be empty; refresh will fill it" : "可空，刷新后自动填入"}'`)}`;
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
  await completeLoginFromCurrentUrl(client);
  const { data: sessionData } = await client.auth.getSession();
  cloud.session = sessionData.session;
  renderCloudUI();
  if (cloud.session) await reconcileCloudOnLogin();
}
async function completeLoginFromCurrentUrl(client) {
  const params = authParamsFromLink(location.href);
  if (!params.has("code") && !params.has("access_token") && !params.has("token_hash") && !params.has("token")) return;
  try {
    await applyAuthParams(client, params);
    history.replaceState({}, document.title, location.origin + location.pathname);
  } catch (error) {
    cloud.diagnostic = `${language === "en" ? "Login link detected but could not be completed on this device" : "检测到登录链接，但未能在此设备完成登录"}：${error.message || error}`;
    cloud.diagnosticType = "error";
  }
}
async function signInWithEmail() {
  const client = ensureSupabaseClient();
  const email = document.querySelector("#authEmailInput").value.trim();
  if (!client) return showToast(language === "en" ? "Save Supabase config first" : "请先保存 Supabase 配置");
  if (!email) return showToast(language === "en" ? "Enter your email" : "请输入邮箱");
  try {
    localStorage.setItem(LAST_EMAIL_KEY, email);
    cloud.diagnostic = language === "en" ? "Sending login email request to Supabase..." : "正在向 Supabase 发送登录邮件请求...";
    cloud.diagnosticType = "";
    renderCloudUI();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: location.origin + location.pathname }
    });
    if (error) throw error;
    cloud.diagnostic = language === "en" ? `Supabase accepted the request: login link sent to ${email}. If it does not arrive, check Authentication → Logs.` : `Supabase 已接受请求：登录链接已发送到 ${email}。如果没收到，请看 Authentication → Logs。`;
    cloud.diagnosticType = "ok";
    renderCloudUI();
    showToast(language === "en" ? "Login link sent. Check your email" : "登录链接已发送，请查看邮箱");
  } catch (error) {
    cloud.diagnostic = `${language === "en" ? "Send failed" : "发送失败"}：${error.message || error}`;
    cloud.diagnosticType = "error";
    renderCloudUI();
    showToast(language === "en" ? "Send failed. Check diagnostics" : "发送失败，请查看诊断信息");
  }
}
function authParamsFromLink(value) {
  return authParamsFromText(value, 0);
}
function authParamsFromText(value, depth = 0) {
  if (depth > 4) return new URLSearchParams();
  const raw = String(value || "").trim();
  const extracted = raw.match(/https?:\/\/[^\s"'<>]+/i)?.[0] || raw;
  let url;
  try {
    url = new URL(extracted, location.origin);
  } catch {
    return paramsFromLooseText(raw);
  }
  const params = new URLSearchParams(url.search);
  const hash = url.hash?.startsWith("#") ? url.hash.slice(1) : url.hash;
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    hashParams.forEach((paramValue, key) => params.set(key, paramValue));
  }
  if (hasAuthToken(params)) return params;
  const nestedKeys = ["url", "u", "q", "redirect", "redirect_url", "redirect_to", "redirectTo", "link", "target", "to"];
  for (const key of nestedKeys) {
    const nested = params.get(key);
    if (!nested) continue;
    const nestedParams = authParamsFromText(decodeRepeatedly(nested), depth + 1);
    if (hasAuthToken(nestedParams)) return nestedParams;
  }
  return params;
}
function paramsFromLooseText(text) {
  const normalized = decodeRepeatedly(text).replace(/^#/, "");
  try {
    const params = new URLSearchParams(normalized);
    return params;
  } catch {
    return new URLSearchParams();
  }
}
function decodeRepeatedly(value) {
  let decoded = String(value || "");
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}
function hasAuthToken(params) {
  return ["code", "access_token", "token_hash", "token"].some(key => params.has(key));
}
async function applyAuthParams(client, params) {
  const code = params.get("code");
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const tokenHash = params.get("token_hash");
  const token = params.get("token") || document.querySelector("#emailOtpInput")?.value.trim();
  const type = params.get("type") || "email";
  const email = document.querySelector("#authEmailInput")?.value.trim() || localStorage.getItem(LAST_EMAIL_KEY) || "";
  if (code) {
    const { data: authData, error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return authData?.session;
  }
  if (accessToken && refreshToken) {
    const { data: authData, error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    if (error) throw error;
    return authData?.session;
  }
  if (tokenHash) {
    const { data: authData, error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) throw error;
    return authData?.session;
  }
  if (token) {
    if (!email) throw new Error(language === "en" ? "This token format also needs your email. Fill the login email field and try again." : "这种 token 格式还需要邮箱。请先填写登录邮箱，再重试。");
    const { data: authData, error } = await client.auth.verifyOtp({ email, token, type });
    if (error) throw error;
    return authData?.session;
  }
  throw new Error(language === "en" ? "No login token was found in this link" : "这个链接里没有找到登录 token");
}
async function completeLoginFromPastedLink() {
  const client = ensureSupabaseClient();
  const input = document.querySelector("#loginLinkInput");
  const otpInput = document.querySelector("#emailOtpInput");
  const value = input.value.trim();
  const tokenValue = otpInput.value.trim();
  if (!client) return showToast(language === "en" ? "Save Supabase config first" : "请先保存 Supabase 配置");
  if (!value && !tokenValue) return showToast(language === "en" ? "Paste the full login link or email code first" : "请先粘贴完整登录链接或邮箱验证码");
  try {
    cloud.diagnostic = language === "en" ? "Completing login on this device..." : "正在把登录写入此设备...";
    cloud.diagnosticType = "";
    renderCloudUI();
    const params = value ? authParamsFromLink(value) : new URLSearchParams();
    if (tokenValue) params.set("token", tokenValue);
    const session = await applyAuthParams(client, params);
    cloud.session = session || (await client.auth.getSession()).data.session;
    if (!cloud.session) throw new Error(language === "en" ? "Supabase did not return a session" : "Supabase 没有返回登录会话");
    input.value = "";
    otpInput.value = "";
    cloud.diagnostic = language === "en" ? `Success: this device is now signed in as ${cloud.session.user.email}.` : `成功：此设备已登录 ${cloud.session.user.email}。`;
    cloud.diagnosticType = "ok";
    renderCloudUI();
    await reconcileCloudOnLogin();
    showToast(language === "en" ? "This device is signed in" : "此设备已登录");
  } catch (error) {
    cloud.diagnostic = `${language === "en" ? "Could not complete login on this device" : "未能在此设备完成登录"}：${error.message || error}`;
    cloud.diagnosticType = "error";
    renderCloudUI();
    showToast(language === "en" ? "Login failed. Check diagnostics" : "登录失败，请查看诊断信息");
  }
}
async function checkDeviceLogin() {
  const client = ensureSupabaseClient();
  if (!client) return showToast(language === "en" ? "Save Supabase config first" : "请先保存 Supabase 配置");
  const { data: sessionData, error } = await client.auth.getSession();
  if (error) {
    cloud.diagnostic = `${language === "en" ? "Login check failed" : "登录检查失败"}：${error.message}`;
    cloud.diagnosticType = "error";
  } else {
    cloud.session = sessionData.session;
    cloud.diagnostic = cloud.session
      ? (language === "en" ? `Confirmed: this device is signed in as ${cloud.session.user.email}.` : `确认：此设备已登录 ${cloud.session.user.email}。`)
      : (language === "en" ? "Confirmed: this device is not signed in yet." : "确认：此设备尚未登录。");
    cloud.diagnosticType = cloud.session ? "ok" : "";
  }
  renderCloudUI();
}
async function testSupabaseConnection() {
  const client = ensureSupabaseClient();
  if (!client) return showToast(language === "en" ? "Save Supabase config first" : "请先保存 Supabase 配置");
  cloud.syncing = true;
  cloud.diagnostic = language === "en" ? "Testing Supabase connection..." : "正在测试 Supabase 连接...";
  cloud.diagnosticType = "";
  renderCloudUI();
  try {
    const { error } = await client.from("little_steward_settings").select("user_id").limit(1);
    if (error) throw error;
    cloud.diagnostic = language === "en" ? "Connection OK: Project URL, Publishable Key, and database tables are reachable. You can send the login link now." : "连接成功：Project URL、Publishable Key、数据库表都可以访问。现在可以发送登录链接。";
    cloud.diagnosticType = "ok";
    showToast(language === "en" ? "Supabase connected" : "Supabase 连接成功");
  } catch (error) {
    cloud.diagnostic = `${language === "en" ? "Connection failed" : "连接失败"}：${error.message || error}`;
    cloud.diagnosticType = "error";
    showToast(language === "en" ? "Connection failed. Check diagnostics" : "连接失败，请查看诊断信息");
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
  showToast(language === "en" ? "Signed out" : "已退出登录");
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
function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}
function base64ToBytes(value) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}
async function deriveVaultKey(passphrase, saltBase64) {
  const encoded = new TextEncoder().encode(passphrase);
  const baseKey = await crypto.subtle.importKey("raw", encoded, "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: base64ToBytes(saltBase64), iterations: 250000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encryptPayload(payload) {
  if (!vaultKey) throw new Error("加密未解锁");
  const iv = randomBytes(12);
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, vaultKey, encoded);
  return { version: 1, kdf: "PBKDF2-SHA256-250000", cipher: "AES-GCM", iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) };
}
async function decryptPayload(vault) {
  if (!vaultKey) throw new Error("加密未解锁");
  const decoded = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(vault.iv) }, vaultKey, base64ToBytes(vault.ciphertext));
  return JSON.parse(new TextDecoder().decode(decoded));
}
function currentPassphrase() {
  return document.querySelector("#encryptionPassphraseInput").value;
}
async function enableEncryption() {
  const passphrase = currentPassphrase();
  if (passphrase.length < 10) return showToast("加密密码至少 10 位");
  const salt = bytesToBase64(randomBytes(16));
  vaultKey = await deriveVaultKey(passphrase, salt);
  saveEncryptionConfig({ enabled: true, salt });
  document.querySelector("#encryptionPassphraseInput").value = "";
  renderEncryptionUI();
  if (cloud.session) {
    await syncToCloud();
    showToast("加密已启用并同步");
  } else {
    showToast("加密已启用，登录后会同步");
  }
}
async function unlockEncryption() {
  const passphrase = currentPassphrase();
  if (!encryption.enabled || !encryption.salt) return showToast("还没有启用加密");
  if (!passphrase) return showToast("请输入加密密码");
  try {
    vaultKey = await deriveVaultKey(passphrase, encryption.salt);
    document.querySelector("#encryptionPassphraseInput").value = "";
    renderEncryptionUI();
    const remote = await fetchCloudData();
    if (remote) {
      data = normalizeData(remote);
      saveLocalData();
      render();
    }
    showToast("加密数据已解锁");
  } catch {
    vaultKey = null;
    showToast("解锁失败，请检查密码");
  }
}
function disableEncryption() {
  localStorage.removeItem(ENCRYPTION_KEY);
  encryption = { enabled: false, salt: "" };
  vaultKey = null;
  renderEncryptionUI();
  showToast("已关闭本机加密设置");
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
    setLoginMessage(language === "en" ? "Waiting for Face ID..." : "等待 Face ID 确认...");
    await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(),
        allowCredentials: [{ type: "public-key", id: base64urlToBytes(biometric.credentialId) }],
        userVerification: "required",
        timeout: 60000
      }
    });
    hideLoginScreen();
    showToast(language === "en" ? "Welcome back" : "欢迎回来");
  } catch {
    setLoginMessage(language === "en" ? "Face ID was not completed. Try again or open settings." : "Face ID 未完成。你可以重试，或进入设置处理登录。");
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
async function refreshAllPrices() {
  try {
    await refreshCryptoPrices({ quiet: true });
    await ensureNeededFxRates();
    await refreshFinnhubPrices({ quiet: true });
    await refreshAlphaVantagePrices({ quiet: true });
    await persistData("价格已刷新");
  } catch (error) {
    showToast(`价格刷新失败：${error.message || error}`);
  }
}
async function refreshCryptoPrices({ quiet = false } = {}) {
  const cryptoWatches = (data.priceWatch || []).filter(w => w.source === "coingecko" && w.coingeckoId);
  if (!cryptoWatches.length) return;
  const vs = data.currency.toLowerCase();
  const ids = [...new Set(cryptoWatches.map(w => w.coingeckoId.trim().toLowerCase()))].join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=${encodeURIComponent(vs)}&include_24hr_change=true&include_last_updated_at=true`;
  try {
    if (!quiet) showToast("正在刷新 Crypto 价格...");
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
        quoteCurrency: data.currency,
        change24h: Number(result[`${vs}_24h_change`]) || 0,
        updatedAt: result.last_updated_at ? new Date(result.last_updated_at * 1000).toISOString() : new Date().toISOString()
      };
      updateLinkedAccountValue(updated);
      return updated;
    });
    if (!quiet) await persistData("Crypto 价格已刷新");
  } catch (error) {
    showToast(`刷新失败：${error.message || error}`);
  }
}
async function refreshFinnhubPrices({ quiet = false } = {}) {
  const token = marketConfig.finnhubToken;
  const watches = (data.priceWatch || []).filter(w => w.source === "finnhub" && w.symbol);
  if (!watches.length) return;
  if (!token) {
    if (!quiet) throw new Error("请先配置 Finnhub API Token");
    return;
  }
  if (!quiet) showToast("正在刷新 Finnhub 股票/ETF 价格...");
  for (const watch of watches) {
    const quote = await fetchFinnhubQuote(watch.symbol, token);
    data.priceWatch = data.priceWatch.map(item => {
      if (item.id !== watch.id) return item;
      const updated = {
        ...item,
        price: quote.price,
        change24h: quote.changePercent,
        currency: item.quoteCurrency || item.currency || "USD",
        quoteCurrency: item.quoteCurrency || item.currency || "USD",
        updatedAt: quote.timestamp ? new Date(quote.timestamp * 1000).toISOString() : new Date().toISOString()
      };
      updateLinkedAccountValue(updated);
      return updated;
    });
  }
  if (!quiet) await persistData("Finnhub 价格已刷新");
}
async function fetchFinnhubQuote(symbol, token) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol.trim().toUpperCase())}&token=${encodeURIComponent(token)}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Finnhub ${response.status}`);
  const quote = await response.json();
  if (quote.error) throw new Error(quote.error);
  if (!Number.isFinite(Number(quote.c)) || Number(quote.c) <= 0) throw new Error(`没有找到 ${symbol} 的报价`);
  return {
    price: Number(quote.c),
    changePercent: Number(quote.dp) || 0,
    timestamp: Number(quote.t) || 0
  };
}
async function refreshAlphaVantagePrices({ quiet = false } = {}) {
  const key = marketConfig.alphaVantageKey;
  const stockWatches = (data.priceWatch || []).filter(w => w.source === "alphavantage" && w.symbol);
  if (!stockWatches.length) return;
  if (!key) throw new Error("请先配置 Alpha Vantage API Key");
  if (!quiet) showToast("正在刷新股票/ETF/基金价格...");
  for (const watch of stockWatches) {
    const quote = await fetchAlphaQuote(watch.symbol, key);
    if (!quote) continue;
    data.priceWatch = data.priceWatch.map(item => {
      if (item.id !== watch.id) return item;
      const updated = {
        ...item,
        price: quote.price,
        change24h: quote.changePercent,
        currency: item.quoteCurrency || item.currency || "USD",
        quoteCurrency: item.quoteCurrency || item.currency || "USD",
        updatedAt: new Date().toISOString()
      };
      updateLinkedAccountValue(updated);
      return updated;
    });
  }
  if (!quiet) await persistData("股票/ETF/基金价格已刷新");
}
async function fetchAlphaQuote(symbol, key) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol.trim().toUpperCase())}&apikey=${encodeURIComponent(key)}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Alpha Vantage ${response.status}`);
  const json = await response.json();
  if (json.Note || json.Information) throw new Error(json.Note || json.Information);
  const quote = json["Global Quote"];
  if (!quote || !quote["05. price"]) throw new Error(`没有找到 ${symbol} 的报价`);
  return {
    price: Number(quote["05. price"]),
    changePercent: Number(String(quote["10. change percent"] || "0").replace("%", ""))
  };
}
async function searchMarketSymbols() {
  const form = document.querySelector("#editorForm");
  const keyword = form.querySelector("[name='symbol']").value.trim() || form.querySelector("[name='name']").value.trim();
  const token = marketConfig.finnhubToken;
  if (!keyword) return showToast("先输入名称或代码关键词");
  if (!token) return showToast("请先配置 Finnhub API Token");
  const target = document.querySelector("#marketSymbolResults");
  target.innerHTML = `<p class="cloud-diagnostic">正在搜索 ${escapeHtml(keyword)}...</p>`;
  try {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(keyword)}&token=${encodeURIComponent(token)}`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`Finnhub ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    const matches = (json.result || []).slice(0, 8);
    target.innerHTML = matches.length ? matches.map(match => {
      const symbol = match.symbol || "";
      const name = match.description || match.displaySymbol || "";
      const type = match.type || "";
      return `<button type="button" class="symbol-result" data-symbol="${escapeHtml(symbol)}" data-name="${escapeHtml(name)}" data-currency="USD"><strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(name)} · ${escapeHtml(type)}</span></button>`;
    }).join("") : `<p class="cloud-diagnostic">没有找到匹配代码。</p>`;
  } catch (error) {
    target.innerHTML = `<p class="cloud-diagnostic error">搜索失败：${escapeHtml(error.message || error)}</p>`;
  }
}
function selectMarketSymbol(button) {
  const form = document.querySelector("#editorForm");
  form.querySelector("[name='symbol']").value = button.dataset.symbol || "";
  form.querySelector("[name='name']").value = button.dataset.name || button.dataset.symbol || "";
  const currency = button.dataset.currency || "USD";
  const currencySelect = form.querySelector("[name='quoteCurrency']");
  if ([...currencySelect.options].some(option => option.value === currency)) currencySelect.value = currency;
  showToast("已选择代码");
}
async function ensureNeededFxRates() {
  const pairs = new Set();
  (data.priceWatch || []).forEach(watch => {
    if (!watch.accountId) return;
    const from = watch.quoteCurrency || watch.currency || data.currency;
    if (from !== data.currency) pairs.add(`${from}_${data.currency}`);
  });
  for (const pair of pairs) await ensureFxRate(pair);
}
async function ensureFxRate(pair) {
  const [from, to] = pair.split("_");
  const updated = marketConfig.fxUpdatedAt ? new Date(marketConfig.fxUpdatedAt).getTime() : 0;
  const fresh = Date.now() - updated < 12 * 60 * 60 * 1000;
  if (marketConfig.fxRates?.[pair] && fresh) return marketConfig.fxRates[pair];
  const key = marketConfig.alphaVantageKey;
  if (!key) throw new Error("请先配置 Alpha Vantage API Key");
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${encodeURIComponent(from)}&to_currency=${encodeURIComponent(to)}&apikey=${encodeURIComponent(key)}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Alpha Vantage FX ${response.status}`);
  const json = await response.json();
  if (json.Note || json.Information) throw new Error(json.Note || json.Information);
  const rate = Number(json["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"]);
  if (!rate) throw new Error(`没有找到 ${from}/${to} 汇率`);
  marketConfig.fxRates = { ...(marketConfig.fxRates || {}), [pair]: rate, [`${to}_${from}`]: 1 / rate };
  marketConfig.fxUpdatedAt = new Date().toISOString();
  saveMarketConfig(marketConfig);
  return rate;
}
function setLoginMessage(text) {
  document.querySelector("#loginSubtitle").textContent = text;
}
function hideLoginScreen() {
  document.querySelector("#loginScreen").classList.add("hidden");
}
function showLoginReady() {
  setLoginMessage(language === "en" ? "Your assets, savings, and Notes are ready." : "你的资产、储蓄和 Notes 已准备好。");
  document.querySelector("#loadingTrack").classList.add("hidden");
  document.querySelector("#enterAppButton").classList.remove("hidden");
  document.querySelector("#loginSettingsButton").classList.remove("hidden");
}
function bootLoginScreen() {
  setTimeout(() => {
    document.querySelector("#loadingTrack").classList.add("hidden");
    if (biometric.enabled) {
      setLoginMessage(language === "en" ? "Face ID quick unlock is enabled." : "已启用 Face ID 快速解锁。");
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
    if (encryption.enabled && !vaultKey) {
      renderEncryptionUI();
      showToast(language === "en" ? "Cloud encryption is enabled. Please unlock first." : "云端加密已启用，请先解锁");
      return;
    }
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
    showToast(`${language === "en" ? "Cloud sync initialization failed" : "云同步初始化失败"}：${error.message}`);
  }
}
async function syncToCloud({ quiet = false } = {}) {
  const client = ensureSupabaseClient();
  if (!client || !cloud.session || cloud.syncing) return;
  if (encryption.enabled && !vaultKey) {
    if (!quiet) showToast("请先解锁加密数据");
    return;
  }
  cloud.syncing = true;
  renderCloudUI();
  try {
    const userId = cloud.session.user.id;
    if (encryption.enabled && vaultKey) {
      await syncVaultToCloud(client, userId);
      if (!quiet) showToast("已加密同步到云端");
      return;
    }
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
  if (encryption.enabled && vaultKey) {
    const vault = await fetchVaultFromCloud(client);
    if (vault) return normalizeData(await decryptPayload(vault));
  }
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
async function syncVaultToCloud(client, userId) {
  const encrypted = await encryptPayload(normalizeData(data));
  const { error } = await client.from("little_steward_vault").upsert({
    user_id: userId,
    id: "default",
    salt: encryption.salt,
    payload: encrypted,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
}
async function fetchVaultFromCloud(client) {
  const { data: row, error } = await client.from("little_steward_vault").select("salt,payload").eq("id", "default").maybeSingle();
  if (error) return null;
  if (row?.salt && row.salt !== encryption.salt) {
    saveEncryptionConfig({ enabled: true, salt: row.salt });
    vaultKey = null;
    renderEncryptionUI();
    throw new Error("云端 Vault 使用另一个密码盐，请重新输入密码解锁");
  }
  return row?.payload || null;
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
  const quoteCurrency = watch.quoteCurrency || watch.currency || data.currency;
  const value = convertCurrency(Number(watch.quantity) * Number(watch.price), quoteCurrency, data.currency);
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
  if (e.target.closest("#marketSymbolSearchButton")) searchMarketSymbols();
  const symbolButton = e.target.closest("[data-symbol]");
  if (symbolButton) selectMarketSymbol(symbolButton);
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
  document.querySelector("#pageTitle").textContent = pageTitle(id);
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
    values.quantity = Number(values.quantity) || 0;
    values.price = Number(values.price) || 0;
    values.change24h = Number(values.change24h) || 0;
    values.quoteCurrency = values.quoteCurrency || values.currency || data.currency;
    values.currency = values.quoteCurrency;
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
document.querySelector("#cloudLoginChip").onclick = () => document.querySelector("#settingsDialog").showModal();
document.querySelector("#closeSettings").onclick = () => document.querySelector("#settingsDialog").close();
document.querySelector("#currencySelect").onchange = async e => {
  data.currency = e.target.value;
  await persistData(language === "en" ? "Currency updated" : "货币已更新");
};
document.querySelector("#languageSelect").onchange = e => {
  language = e.target.value === "en" ? "en" : "zh";
  localStorage.setItem(LANGUAGE_KEY, language);
  cloud.diagnostic = tr("configuredHint");
  render();
  showToast(language === "en" ? "Language updated" : "语言已更新");
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
document.querySelector("#completeLoginLinkButton").onclick = completeLoginFromPastedLink;
document.querySelector("#checkDeviceLoginButton").onclick = checkDeviceLogin;
document.querySelector("#checkSignedInDeviceButton").onclick = checkDeviceLogin;
document.querySelector("#testSupabaseConnection").onclick = testSupabaseConnection;
document.querySelector("#signOutButton").onclick = signOut;
document.querySelector("#syncNowButton").onclick = () => syncToCloud();
document.querySelector("#pullCloudButton").onclick = () => pullFromCloud();
document.querySelector("#refreshPricesButton").onclick = refreshAllPrices;
document.querySelector("#enableFaceIdButton").onclick = enableFaceIdUnlock;
document.querySelector("#disableFaceIdButton").onclick = disableFaceIdUnlock;
document.querySelector("#enableEncryptionButton").onclick = enableEncryption;
document.querySelector("#unlockEncryptionButton").onclick = unlockEncryption;
document.querySelector("#disableEncryptionButton").onclick = disableEncryption;
document.querySelector("#exportDataButton").onclick = exportData;
document.querySelector("#importDataInput").onchange = e => importData(e.target.files[0]);
document.querySelector("#saveMarketConfigButton").onclick = () => {
  const finnhubToken = document.querySelector("#finnhubTokenInput").value.trim();
  const alphaVantageKey = document.querySelector("#alphaVantageKeyInput").value.trim();
  saveMarketConfig({ ...marketConfig, finnhubToken, alphaVantageKey });
  renderMarketUI();
  showToast("行情设置已保存");
};
document.querySelector("#faceUnlockButton").onclick = unlockWithFaceId;
document.querySelector("#enterAppButton").onclick = hideLoginScreen;
document.querySelector("#loginSettingsButton").onclick = () => {
  hideLoginScreen();
  document.querySelector("#settingsDialog").showModal();
};

document.querySelector("#currencySelect").value = data.currency;
document.querySelector("#languageSelect").value = language;
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
