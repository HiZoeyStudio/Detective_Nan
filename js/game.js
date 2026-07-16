const pageTitles = {
  dashboard: "案件首页",
  case: "案件概况",
  evidence: "证据清单",
  people: "人物档案",
  interviews: "访谈记录",
  timeline: "案件时间线",
  notes: "调查笔记",
  conclusion: "提交结论"
};

const readItems = new Set(JSON.parse(localStorage.getItem("dragonFruitRead") || "[]"));

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  document.getElementById("page-title").textContent = pageTitles[pageId] || "案件系统";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

function openModal(type, title, content, id = null) {
  document.getElementById("modal-type").textContent = type;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-content").innerHTML = `<p>${content}</p>`;
  document.getElementById("modal").classList.remove("hidden");

  if (id) {
    readItems.add(id);
    localStorage.setItem("dragonFruitRead", JSON.stringify([...readItems]));
    renderEvidence();
    updateProgress();
  }
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", event => {
  if (event.target.id === "modal") closeModal();
});

function renderEvidence() {
  const container = document.getElementById("evidence-list");
  container.innerHTML = GAME_DATA.evidence.map(item => `
    <article class="info-card">
      <button data-evidence-id="${item.id}">
        <span class="section-label">${item.id} · ${item.type}</span>
        <h4>${item.title}</h4>
        <p>${item.summary}</p>
        ${readItems.has(item.id) ? '<span class="read-mark">已查看</span>' : ""}
      </button>
    </article>
  `).join("");

  container.querySelectorAll("[data-evidence-id]").forEach(button => {
    button.addEventListener("click", () => {
      const item = GAME_DATA.evidence.find(evidence => evidence.id === button.dataset.evidenceId);
      openModal(item.type, item.title, item.content, item.id);
    });
  });
}

function renderPeople() {
  const container = document.getElementById("people-list");
  container.innerHTML = GAME_DATA.people.map(person => `
    <article class="info-card">
      <button data-person-id="${person.id}">
        <span class="section-label">${person.id} · ${person.role}</span>
        <h4>${person.name}</h4>
        <p>${person.description}</p>
      </button>
    </article>
  `).join("");

  container.querySelectorAll("[data-person-id]").forEach(button => {
    button.addEventListener("click", () => {
      const person = GAME_DATA.people.find(item => item.id === button.dataset.personId);
      openModal(person.role, person.name, person.description);
    });
  });
}

function renderInterviews() {
  document.getElementById("interview-list").innerHTML = GAME_DATA.interviews.map(item => `
    <article class="stack-item">
      <strong>${item.time}</strong>
      <div>
        <strong>${item.title}</strong>
        <p>${item.content}</p>
      </div>
    </article>
  `).join("");
}

function renderTimeline() {
  document.getElementById("timeline-list").innerHTML = GAME_DATA.timeline.map(item => `
    <article class="timeline-item">
      <span class="timeline-dot"></span>
      <time>${item.time}</time>
      <p>${item.event}</p>
    </article>
  `).join("");
}

function updateProgress() {
  const readCount = readItems.size;
  const total = GAME_DATA.evidence.length;
  const percent = Math.round((readCount / total) * 100);

  document.getElementById("read-count").textContent = readCount;
  document.getElementById("progress-text").textContent = `${percent}%`;
}

const notesBox = document.getElementById("notes-box");
notesBox.value = localStorage.getItem("dragonFruitNotes") || "";

document.getElementById("save-notes").addEventListener("click", () => {
  localStorage.setItem("dragonFruitNotes", notesBox.value);
  const message = document.getElementById("save-message");
  message.textContent = "笔记已保存";
  setTimeout(() => message.textContent = "", 1800);
});

document.getElementById("conclusion-form").addEventListener("submit", event => {
  event.preventDefault();

  const person = document.getElementById("answer-person").value;
  const location = document.getElementById("answer-location").value.trim();
  const reasoning = document.getElementById("answer-reasoning").value.trim();
  const result = document.getElementById("result-box");

  if (!person || !location || !reasoning) {
    result.textContent = "系统提示：请完整填写三项调查结论。";
    result.classList.remove("hidden");
    return;
  }

  result.innerHTML = `
    <strong>结论已提交</strong>
    <p>当前基础版本尚未设置唯一正确答案。你可以之后在 js/game.js 中加入正式判定逻辑。</p>
  `;
  result.classList.remove("hidden");
});

renderEvidence();
renderPeople();
renderInterviews();
renderTimeline();
updateProgress();
