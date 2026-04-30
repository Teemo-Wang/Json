const STORAGE_KEY = "flowbook-mobile-demo-entries";
const BASE_ASSET = 39899.5;

const CATEGORY_META = {
  餐饮: { color: "#29d35f", icon: "☕", accent: "rgba(207, 122, 26, 0.16)", border: "rgba(207, 122, 26, 0.26)" },
  购物: { color: "#7b4dff", icon: "🛒", accent: "rgba(123, 77, 255, 0.14)", border: "rgba(123, 77, 255, 0.26)" },
  交通: { color: "#cf7a1a", icon: "🚕", accent: "rgba(207, 122, 26, 0.14)", border: "rgba(207, 122, 26, 0.26)" },
  账单: { color: "#1f9bff", icon: "⚡", accent: "rgba(31, 155, 255, 0.14)", border: "rgba(31, 155, 255, 0.24)" },
  收入: { color: "#29d35f", icon: "↗", accent: "rgba(41, 211, 95, 0.12)", border: "rgba(41, 211, 95, 0.24)" },
  转账: { color: "#4d90ff", icon: "✈", accent: "rgba(77, 144, 255, 0.14)", border: "rgba(77, 144, 255, 0.24)" },
  其他: { color: "#9f59ff", icon: "•", accent: "rgba(159, 89, 255, 0.14)", border: "rgba(159, 89, 255, 0.24)" },
};

const CATEGORY_OPTIONS = {
  expense: ["餐饮", "购物", "交通", "账单"],
  income: ["收入"],
  transfer: ["转账"],
};

const PRESET_AMOUNTS = {
  expense: [18, 38, 68, 128],
  income: [1000, 2500, 5000, 12500],
  transfer: [200, 500, 1000, 2000],
};

const seedEntries = [
  { id: "e1", type: "expense", category: "餐饮", title: "星巴克咖啡", amount: 38, datetime: "2026-04-30T09:21" },
  { id: "e2", type: "income", category: "收入", title: "工资收入", amount: 12500, datetime: "2026-04-30T08:00" },
  { id: "e3", type: "expense", category: "购物", title: "超市购物", amount: 256.5, datetime: "2026-04-29T18:43" },
  { id: "e4", type: "expense", category: "账单", title: "电费缴纳", amount: 120, datetime: "2026-04-29T14:10" },
  { id: "e5", type: "expense", category: "交通", title: "滴滴打车", amount: 45, datetime: "2026-04-28T20:30" },
  { id: "e6", type: "expense", category: "餐饮", title: "外卖订单", amount: 68, datetime: "2026-04-28T12:15" },
  { id: "e7", type: "expense", category: "餐饮", title: "周末聚餐", amount: 1134, datetime: "2026-04-18T19:30" },
  { id: "e8", type: "expense", category: "购物", title: "生活用品", amount: 523.5, datetime: "2026-04-15T16:10" },
  { id: "e9", type: "expense", category: "交通", title: "地铁充值", amount: 435, datetime: "2026-04-09T09:00" },
  { id: "e10", type: "income", category: "收入", title: "奖金到账", amount: 1700, datetime: "2026-04-12T11:40" },
  { id: "e11", type: "expense", category: "居家", title: "日用家居", amount: 450, datetime: "2026-04-21T13:10" },
  { id: "e12", type: "expense", category: "医疗", title: "药店采购", amount: 360, datetime: "2026-04-20T20:10" },
  { id: "e13", type: "expense", category: "娱乐", title: "周末观影", amount: 399, datetime: "2026-04-17T21:20" },
  { id: "e14", type: "expense", category: "旅行", title: "短途出行", amount: 430, datetime: "2026-04-14T09:15" },
  { id: "e15", type: "expense", category: "宠物", title: "宠物护理", amount: 400, datetime: "2026-04-13T18:25" },
  { id: "e16", type: "expense", category: "学习", title: "课程订阅", amount: 380, datetime: "2026-04-10T22:10" },
  { id: "e17", type: "expense", category: "订阅", title: "软件会员", amount: 410, datetime: "2026-04-08T08:40" },
  { id: "e18", type: "expense", category: "健身", title: "私教课程", amount: 390, datetime: "2026-04-06T19:00" },
];

const state = {
  view: "home",
  recentFilter: "all",
  sheetType: "expense",
  showAllRecent: false,
  entries: [],
};

const refs = {
  assetTotal: document.querySelector("#asset-total"),
  monthIncome: document.querySelector("#month-income"),
  monthExpense: document.querySelector("#month-expense"),
  expenseOverview: document.querySelector("#expense-overview"),
  recentFilter: document.querySelector("#recent-filter"),
  recentList: document.querySelector("#recent-list"),
  toggleAllButton: document.querySelector("#toggle-all-button"),
  bottomNav: document.querySelector("#bottom-nav"),
  appViews: [...document.querySelectorAll(".app-view")],
  navItems: [...document.querySelectorAll(".nav-item")],
  fabButton: document.querySelector("#fab-button"),
  quickItems: [...document.querySelectorAll("[data-modal-type]")],
  moreButton: document.querySelector("#more-button"),
  modalBackdrop: document.querySelector("#modal-backdrop"),
  closeSheetButton: document.querySelector("#close-sheet-button"),
  entryTypeSwitch: document.querySelector("#entry-type-switch"),
  sheetTitle: document.querySelector("#sheet-title"),
  amountInput: document.querySelector("#amount-input"),
  categoryInput: document.querySelector("#category-input"),
  noteInput: document.querySelector("#note-input"),
  datetimeInput: document.querySelector("#datetime-input"),
  entryForm: document.querySelector("#entry-form"),
  presetRow: document.querySelector("#preset-row"),
  recentTemplate: document.querySelector("#recent-item-template"),
  statsNetBalance: document.querySelector("#stats-net-balance"),
  statsEntryCount: document.querySelector("#stats-entry-count"),
  statsBreakdown: document.querySelector("#stats-breakdown"),
  totalIncome: document.querySelector("#total-income"),
  totalExpense: document.querySelector("#total-expense"),
  resetButton: document.querySelector("#reset-button"),
  openExpenseButton: document.querySelector("#open-expense-button"),
  statsMonthLabel: document.querySelector("#stats-month-label"),
};

function loadEntries() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [...seedEntries];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...seedEntries];
  } catch (error) {
    return [...seedEntries];
  }
}

function persistEntries() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function formatMoney(value, digits = 1) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function getNow() {
  return new Date("2026-04-30T09:41:00");
}

function getLocalDateTimeInputValue(date = getNow()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function getMonthEntries(entries = state.entries) {
  const now = getNow();
  return entries.filter((entry) => {
    const date = new Date(entry.datetime);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
}

function getSortedEntries(entries = state.entries) {
  return [...entries].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
}

function getMeta(category, type) {
  if (type === "income") {
    return CATEGORY_META.收入;
  }
  if (type === "transfer") {
    return CATEGORY_META.转账;
  }
  return CATEGORY_META[category] || CATEGORY_META.其他;
}

function formatRelativeDate(datetime) {
  const date = new Date(datetime);
  const now = getNow();
  const dateLabel = `${`${date.getMonth() + 1}`.padStart(2, "0")}/${`${date.getDate()}`.padStart(2, "0")}`;
  const timeLabel = `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
  const diffDays = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000);

  if (diffDays === 0) {
    return `今天 ${timeLabel}`;
  }
  if (diffDays === 1) {
    return `昨天 ${timeLabel}`;
  }
  return `${dateLabel} ${timeLabel}`;
}

function computeSummary() {
  const monthEntries = getMonthEntries();
  const monthIncome = monthEntries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const monthExpense = monthEntries.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + entry.amount, 0);
  const totalIncome = state.entries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpense = state.entries.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + entry.amount, 0);
  const assetTotal = BASE_ASSET + totalIncome - totalExpense;

  return {
    monthEntries,
    monthIncome,
    monthExpense,
    totalIncome,
    totalExpense,
    assetTotal,
    netBalance: monthIncome - monthExpense,
  };
}

function computeExpenseBreakdown(entries) {
  const expenseEntries = entries.filter((entry) => entry.type === "expense");
  const total = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const grouped = new Map();

  expenseEntries.forEach((entry) => {
    grouped.set(entry.category, (grouped.get(entry.category) || 0) + entry.amount);
  });

  return [...grouped.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      ratio: total ? amount / total : 0,
      color: getMeta(category, "expense").color,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function renderAssetCard(summary) {
  const formattedAsset = formatMoney(summary.assetTotal, 2).replace("¥", "");
  refs.assetTotal.innerHTML = `<span class="asset-currency">¥</span><span class="asset-amount">${formattedAsset}</span>`;
  refs.monthIncome.textContent = formatMoney(summary.monthIncome, 0);
  refs.monthExpense.textContent = formatMoney(summary.monthExpense, 0);
}

function renderExpenseOverview(summary) {
  const breakdown = computeExpenseBreakdown(summary.monthEntries).slice(0, 3);
  refs.expenseOverview.innerHTML = "";

  if (!breakdown.length) {
    refs.expenseOverview.innerHTML = '<div class="recent-meta">本月还没有支出数据。</div>';
    return;
  }

  breakdown.forEach((item) => {
    const row = document.createElement("div");
    row.className = "expense-row";
    row.innerHTML = `
      <div class="expense-meta">
        <span class="expense-name">${item.category}</span>
        <span class="expense-value">${formatMoney(item.amount, 0)}</span>
      </div>
      <div class="expense-track">
        <div class="expense-bar" style="width:${Math.max(item.ratio * 100, 8)}%; background:${item.color};"></div>
      </div>
    `;
    refs.expenseOverview.append(row);
  });
}

function renderRecentFilters() {
  const filters = [
    { key: "all", label: "全部" },
    { key: "income", label: "收入" },
    { key: "expense", label: "支出" },
  ];

  refs.recentFilter.innerHTML = "";
  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `segment-button${state.recentFilter === filter.key ? " is-active" : ""}`;
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.recentFilter = filter.key;
      renderRecentList();
      renderRecentFilters();
    });
    refs.recentFilter.append(button);
  });
}

function renderRecentList() {
  refs.recentList.innerHTML = "";
  const filtered = getSortedEntries().filter((entry) => state.recentFilter === "all" || entry.type === state.recentFilter);
  const visibleEntries = state.showAllRecent ? filtered : filtered.slice(0, 6);

  refs.toggleAllButton.textContent = state.showAllRecent ? "收起" : "查看全部";

  visibleEntries.forEach((entry) => {
    const node = refs.recentTemplate.content.firstElementChild.cloneNode(true);
    const meta = getMeta(entry.category, entry.type);
    const amountClass = entry.type === "income" ? "amount-income" : entry.type === "transfer" ? "amount-transfer" : "amount-expense";
    const sign = entry.type === "income" ? "+" : entry.type === "transfer" ? "" : "";

    const iconNode = node.querySelector(".recent-icon");
    iconNode.textContent = meta.icon;
    iconNode.style.color = meta.color;
    iconNode.style.background = meta.accent;
    iconNode.style.borderColor = meta.border;

    node.querySelector(".recent-title").textContent = entry.title;
    node.querySelector(".recent-meta").textContent = `${entry.category} · ${formatRelativeDate(entry.datetime)}`;
    const amountNode = node.querySelector(".recent-amount");
    amountNode.textContent = `${sign}${formatMoney(entry.amount, 1)}`;
    amountNode.classList.add(amountClass);

    refs.recentList.append(node);
  });
}

function renderStats(summary) {
  refs.statsNetBalance.textContent = formatMoney(summary.netBalance, 2);
  refs.statsEntryCount.textContent = `${summary.monthEntries.length} 笔`;
  refs.totalIncome.textContent = formatMoney(summary.totalIncome, 2);
  refs.totalExpense.textContent = formatMoney(summary.totalExpense, 2);
  refs.statsMonthLabel.textContent = "2026 年 4 月";
  refs.statsBreakdown.innerHTML = "";

  const breakdown = computeExpenseBreakdown(summary.monthEntries);
  if (!breakdown.length) {
    refs.statsBreakdown.innerHTML = '<div class="recent-meta">暂无分类数据。</div>';
    return;
  }

  breakdown.forEach((item) => {
    const row = document.createElement("div");
    row.className = "stats-line";
    row.innerHTML = `
      <div class="stats-line-head">
        <span>${item.category}</span>
        <strong>${formatMoney(item.amount, 1)}</strong>
      </div>
      <div class="stats-line-track">
        <div class="stats-line-fill" style="width:${Math.max(item.ratio * 100, 8)}%; background:${item.color};"></div>
      </div>
    `;
    refs.statsBreakdown.append(row);
  });
}

function setView(view) {
  state.view = view;
  refs.appViews.forEach((node) => node.classList.toggle("is-active", node.dataset.view === view));
  refs.navItems.forEach((node) => node.classList.toggle("is-active", node.dataset.viewTarget === view));
}

function openSheet(type = "expense") {
  state.sheetType = type;
  refs.modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  updateSheetControls();
}

function closeSheet() {
  refs.modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function updateSheetControls() {
  refs.sheetTitle.textContent =
    state.sheetType === "income" ? "新增收入" : state.sheetType === "transfer" ? "新增转账" : "新增支出";

  refs.entryTypeSwitch.querySelectorAll(".sheet-tab").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.entryType === state.sheetType);
  });

  refs.categoryInput.innerHTML = "";
  CATEGORY_OPTIONS[state.sheetType].forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    refs.categoryInput.append(option);
  });

  refs.presetRow.innerHTML = "";
  PRESET_AMOUNTS[state.sheetType].forEach((amount) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-chip";
    button.textContent = state.sheetType === "income" ? `+${amount}` : `¥${amount}`;
    button.addEventListener("click", () => {
      refs.amountInput.value = amount;
      refs.amountInput.focus();
    });
    refs.presetRow.append(button);
  });
}

function resetForm() {
  refs.entryForm.reset();
  refs.datetimeInput.value = getLocalDateTimeInputValue();
  updateSheetControls();
}

function renderApp() {
  const summary = computeSummary();
  renderAssetCard(summary);
  renderExpenseOverview(summary);
  renderRecentFilters();
  renderRecentList();
  renderStats(summary);
}

function bindEvents() {
  refs.bottomNav.addEventListener("click", (event) => {
    const target = event.target.closest("[data-view-target]");
    if (!target) {
      return;
    }
    setView(target.dataset.viewTarget);
  });

  refs.fabButton.addEventListener("click", () => openSheet("expense"));
  refs.quickItems.forEach((button) => {
    button.addEventListener("click", () => openSheet(button.dataset.modalType));
  });

  refs.moreButton.addEventListener("click", () => setView("settings"));
  refs.toggleAllButton.addEventListener("click", () => {
    state.showAllRecent = !state.showAllRecent;
    renderRecentList();
  });

  refs.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === refs.modalBackdrop) {
      closeSheet();
    }
  });

  refs.closeSheetButton.addEventListener("click", closeSheet);

  refs.entryTypeSwitch.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-entry-type]");
    if (!tab) {
      return;
    }
    state.sheetType = tab.dataset.entryType;
    updateSheetControls();
  });

  refs.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = Number(refs.amountInput.value);
    if (!amount) {
      return;
    }

    state.entries.unshift({
      id: `entry-${Date.now()}`,
      type: state.sheetType,
      category: refs.categoryInput.value,
      title: refs.noteInput.value.trim() || `${refs.categoryInput.value}记录`,
      amount,
      datetime: refs.datetimeInput.value,
    });

    persistEntries();
    renderApp();
    resetForm();
    closeSheet();
    setView("home");
  });

  refs.resetButton.addEventListener("click", () => {
    state.entries = [...seedEntries];
    persistEntries();
    renderApp();
    setView("home");
  });

  refs.openExpenseButton.addEventListener("click", () => openSheet("expense"));
}

function init() {
  state.entries = loadEntries();
  refs.datetimeInput.value = getLocalDateTimeInputValue();
  bindEvents();
  resetForm();
  renderApp();
}

init();
