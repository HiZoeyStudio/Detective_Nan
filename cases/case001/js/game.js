const titles={overview:"案件概况",evidence:"证据清单",people:"人物档案",interviews:"访谈记录",timeline:"案件时间线",notes:"调查笔记",conclusion:"提交结论"};
const readItems=new Set(JSON.parse(localStorage.getItem("case001Read")||"[]"));

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  document.getElementById("page-title").textContent=titles[id];
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

function openModal(type,title,content,id){
  document.getElementById("modal-type").textContent=type;
  document.getElementById("modal-title").textContent=title;
  document.getElementById("modal-content").innerHTML=`<p>${content}</p>`;
  document.getElementById("modal").classList.remove("hidden");
  if(id){readItems.add(id);localStorage.setItem("case001Read",JSON.stringify([...readItems]));renderEvidence();}
}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
document.getElementById("modal-close").addEventListener("click",closeModal);
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});

function renderEvidence(){
  const el=document.getElementById("evidence-list");
  el.innerHTML=GAME_DATA.evidence.map(x=>`<article class="info-card"><button data-id="${x.id}"><span class="label">${x.id} · ${x.type}</span><h4>${x.title}</h4><p>${x.summary}</p>${readItems.has(x.id)?'<span class="read-mark">已查看</span>':""}</button></article>`).join("");
  el.querySelectorAll("[data-id]").forEach(b=>b.addEventListener("click",()=>{const x=GAME_DATA.evidence.find(i=>i.id===b.dataset.id);openModal(x.type,x.title,x.content,x.id)}));
}
function renderPeople(){
  const el=document.getElementById("people-list");
  el.innerHTML=GAME_DATA.people.map(x=>`<article class="info-card"><button data-person="${x.id}"><span class="label">${x.id} · ${x.role}</span><h4>${x.name}</h4><p>${x.description}</p></button></article>`).join("");
  el.querySelectorAll("[data-person]").forEach(b=>b.addEventListener("click",()=>{const x=GAME_DATA.people.find(i=>i.id===b.dataset.person);openModal(x.role,x.name,x.description)}));
}
document.getElementById("interview-list").innerHTML=GAME_DATA.interviews.map(x=>`<article class="stack-item"><strong>${x.time}</strong><div><strong>${x.title}</strong><p>${x.content}</p></div></article>`).join("");
document.getElementById("timeline-list").innerHTML=GAME_DATA.timeline.map(x=>`<article class="timeline-item"><span class="timeline-dot"></span><time>${x.time}</time><p>${x.event}</p></article>`).join("");

const notes=document.getElementById("notes-box");
notes.value=localStorage.getItem("case001Notes")||"";
document.getElementById("save-notes").addEventListener("click",()=>{
  localStorage.setItem("case001Notes",notes.value);
  const msg=document.getElementById("save-message");
  msg.textContent="笔记已保存";
  setTimeout(()=>msg.textContent="",1600);
});

document.getElementById("conclusion-form").addEventListener("submit",e=>{
  e.preventDefault();
  const person=document.getElementById("answer-person").value;
  const location=document.getElementById("answer-location").value.trim();
  const reasoning=document.getElementById("answer-reasoning").value.trim();
  const box=document.getElementById("result-box");
  if(!person||!location||!reasoning){
    box.textContent="请先完整填写调查结论。";
    box.classList.remove("hidden");
    return;
  }
  localStorage.setItem("case001Completed","true");
  box.innerHTML="<strong>案件结论已提交</strong><p>当前版本尚未设置唯一正确答案。案件已标记为完成，返回事务所后会看到新的记录。</p>";
  box.classList.remove("hidden");
});

renderEvidence();
renderPeople();
