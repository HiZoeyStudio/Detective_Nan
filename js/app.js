const sectionTitles = {
  home: "事务所首页",
  cases: "案件档案库",
  staff: "员工名册",
  achievements: "事务所记录"
};

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.section;

    document.querySelectorAll(".section").forEach(section => {
      section.classList.toggle("active", section.id === id);
    });

    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    document.getElementById("section-title").textContent = sectionTitles[id];
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelectorAll("[data-open-case]").forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "cases/case001/";
  });
});

const completed = localStorage.getItem("case001Completed") === "true";
if (completed) {
  document.getElementById("completed-count").textContent = "1";
  document.getElementById("achievement-title").textContent = "优秀水果调查员";
  document.getElementById("achievement-text").textContent =
    "你已经完成 CASE 001：火龙果消失事件。";
}
