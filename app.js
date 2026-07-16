const state = {
  route: "home",
  read: JSON.parse(localStorage.getItem("nan-read") || "[]"),
  solved: JSON.parse(localStorage.getItem("nan-solved") || "[]"),
  activeCase: null,
  clueIndex: 0
};

const app = document.querySelector("#app");

function save() {
  localStorage.setItem("nan-read", JSON.stringify(state.read));
  localStorage.setItem("nan-solved", JSON.stringify(state.solved));
}

function clone(id) { return document.querySelector(id).content.cloneNode(true); }

function updateNav() {
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.route === state.route));
  const unread = window.CASES.filter(c => !state.read.includes(c.id)).length;
  const badge = document.querySelector("#mailBadge");
  badge.textContent = unread;
  badge.hidden = unread === 0;
}

function navigate(route, caseId) {
  state.route = route;
  state.activeCase = caseId || state.activeCase;
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
  app.focus({ preventScroll: true });
}

function render() {
  app.innerHTML = "";
  updateNav();
  if (state.route === "home") app.append(clone("#homeTemplate"));
  if (state.route === "inbox") renderInbox();
  if (state.route === "email") renderEmail();
  if (state.route === "case") renderCase();
  if (state.route === "archive") renderArchive();
}

function renderInbox() {
  app.append(clone("#inboxTemplate"));
  const list = document.querySelector("#mailList");
  document.querySelector("#inboxCount").textContent = window.CASES.length;
  document.querySelector("#mailMeta").textContent = `${window.CASES.length} 封邮件`;
  window.CASES.forEach(item => {
    const row = document.createElement("button");
    row.className = `mail-row ${state.read.includes(item.id) ? "read" : "unread"}`;
    row.innerHTML = `<span class="unread-dot"></span><span class="sender">${item.sender}</span><span class="subject"><strong>${item.title}</strong><small>${item.preview}</small></span><span class="mail-date">${item.date}</span>`;
    row.addEventListener("click", () => { if (!state.read.includes(item.id)) state.read.push(item.id); save(); navigate("email", item.id); });
    list.append(row);
  });
}

function renderEmail() {
  const item = window.CASES.find(c => c.id === state.activeCase) || window.CASES[0];
  app.innerHTML = `<section class="email-page page-enter"><button class="back" data-route="inbox">← 返回收件箱</button><article class="letter"><div class="letter-head"><div><span class="case-number">委托编号 NAN-${item.number}</span><h1>${item.title}</h1></div><span class="difficulty">难度 · ${item.difficulty}</span></div><div class="from"><div class="avatar">${item.sender[0]}</div><div><strong>${item.sender}</strong><small>${item.email}</small></div><time>${item.date}</time></div><div class="letter-body">${item.body.map(p => `<p>${p}</p>`).join("")}</div><div class="commission"><span>委托报酬 <strong>${item.reward}</strong></span><button class="primary" id="acceptCase">接受委托 <span>→</span></button></div></article></section>`;
  document.querySelector("#acceptCase").addEventListener("click", () => { state.clueIndex = 0; navigate("case", item.id); });
}

function renderCase() {
  const item = window.CASES.find(c => c.id === state.activeCase) || window.CASES[0];
  const solved = state.solved.includes(item.id);
  app.innerHTML = `<section class="case-page page-enter"><div class="case-heading"><button class="back" data-route="inbox">← 暂停调查</button><p class="eyebrow">CASE NAN-${item.number}</p><h1>${item.title}</h1><div class="progress"><span style="width:${solved ? 100 : 58}%"></span></div></div><div class="investigation"><aside><h3>调查笔记</h3><p>查看全部线索，找出证词与物证之间的矛盾。</p><div class="clue-tabs">${item.clues.map((c,i) => `<button class="clue-tab ${i === state.clueIndex ? "active" : ""}" data-clue="${i}"><span>${String(i+1).padStart(2,"0")}</span>${c.title}</button>`).join("")}</div></aside><div class="evidence"><div class="evidence-card"><span class="evidence-tag">${item.clues[state.clueIndex].tag}</span><span class="evidence-count">线索 ${state.clueIndex+1} / ${item.clues.length}</span><div class="evidence-icon">⌕</div><h2>${item.clues[state.clueIndex].title}</h2><p>${item.clues[state.clueIndex].text}</p></div><button class="solve-button" id="openSolve">${solved ? "查看结案报告" : "我已找到真相"} <span>→</span></button></div></div></section><div id="solveModal"></div>`;
  document.querySelectorAll(".clue-tab").forEach(btn => btn.addEventListener("click", () => { state.clueIndex = Number(btn.dataset.clue); renderCase(); }));
  document.querySelector("#openSolve").addEventListener("click", () => renderSolveModal(item, solved));
}

function renderSolveModal(item, solved = false) {
  const modal = document.querySelector("#solveModal");
  modal.innerHTML = `<div class="modal-backdrop"><section class="modal page-enter"><button class="modal-close" aria-label="关闭">×</button>${solved ? resultMarkup(item, true) : `<p class="eyebrow">FINAL DEDUCTION</p><h2>${item.question}</h2><p class="modal-intro">选择嫌疑人。提交后将无法更改本次推理。</p><div class="suspects">${item.suspects.map(s => `<button data-suspect="${s}">${s}</button>`).join("")}</div><button class="primary submit" disabled>提交推理</button>`}</section></div>`;
  modal.querySelector(".modal-close").addEventListener("click", () => modal.innerHTML = "");
  if (!solved) {
    let selected = "";
    modal.querySelectorAll("[data-suspect]").forEach(btn => btn.addEventListener("click", () => { selected = btn.dataset.suspect; modal.querySelectorAll("[data-suspect]").forEach(b => b.classList.toggle("selected", b === btn)); modal.querySelector(".submit").disabled = false; }));
    modal.querySelector(".submit").addEventListener("click", () => {
      const correct = selected === item.answer;
      if (correct && !state.solved.includes(item.id)) { state.solved.push(item.id); save(); }
      modal.querySelector(".modal").innerHTML = `<button class="modal-close" aria-label="关闭">×</button>${resultMarkup(item, correct)}`;
      modal.querySelector(".modal-close").addEventListener("click", () => { modal.innerHTML = ""; if (correct) renderCase(); });
    });
  }
}

function resultMarkup(item, correct) {
  return `<div class="verdict ${correct ? "correct" : "wrong"}"><span>${correct ? "✓" : "×"}</span><p class="eyebrow">${correct ? "CASE CLOSED" : "DEDUCTION FAILED"}</p><h2>${correct ? "推理正确，案件告破" : "还有细节没有对上"}</h2><p>${correct ? item.explanation : "重新检查泥点的来源、案发前发生的事，以及谁有机会接触钥匙。"}</p>${correct ? `<div class="answer">真凶：<strong>${item.answer}</strong></div>` : ""}</div>`;
}

function renderArchive() {
  app.append(clone("#archiveTemplate"));
  const list = document.querySelector("#archiveList");
  window.CASES.forEach(item => {
    const solved = state.solved.includes(item.id);
    const card = document.createElement("article");
    card.className = `archive-card ${solved ? "solved" : "locked"}`;
    card.innerHTML = `<span class="archive-no">NAN-${item.number}</span><span class="archive-status">${solved ? "已结案" : "调查中"}</span><h2>${item.title}</h2><p>${solved ? `真凶：${item.answer}` : "档案将在案件告破后解锁。"}</p><button>${solved ? "查看档案 →" : "继续调查 →"}</button>`;
    card.querySelector("button").addEventListener("click", () => navigate(solved ? "case" : "email", item.id));
    list.append(card);
  });
}

document.addEventListener("click", e => {
  const trigger = e.target.closest("[data-route]");
  if (trigger) navigate(trigger.dataset.route);
});

render();
