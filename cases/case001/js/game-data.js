const GAME_DATA = {
  evidence: [
    {id:"E-001",title:"报案记录",type:"委托材料",summary:"报案人提交的最初记录。",content:"这里暂时保留为占位内容，之后可以加入报案经过。"},
    {id:"E-002",title:"现场照片",type:"现场资料",summary:"事务所公共区域照片。",content:"后续可以把图片放进 images 文件夹。"},
    {id:"E-003",title:"内部群聊截图",type:"数字证据",summary:"案发前后的员工聊天。",content:"可以加入搞笑对话、误导信息和关键线索。"},
    {id:"E-004",title:"监控记录",type:"影像资料",summary:"公共区域人员行动记录。",content:"可以加入进入时间、离开时间和监控死角。"},
    {id:"E-005",title:"冰箱物品清单",type:"现场资料",summary:"案发后登记的冰箱内容。",content:"适合放置被移动或改装后的物品线索。"},
    {id:"E-006",title:"外卖订单",type:"数字证据",summary:"当天事务所食品订单。",content:"用于确认谁点了什么以及人物的饮食安排。"},
    {id:"E-007",title:"垃圾桶检查记录",type:"现场资料",summary:"对垃圾桶进行的严肃调查。",content:"可以加入关键物证或纯粹的搞笑干扰项。"},
    {id:"E-008",title:"办公用品借用记录",type:"内部文件",summary:"可能影响员工行动路线。",content:"适合用于证明某人在特定时间经过某处。"}
  ],
  people: [
    {id:"P-001",name:"谢楠",role:"事务所负责人",description:"本案负责人，决定正式调查一颗火龙果。"},
    {id:"P-002",name:"报案人",role:"内部人员",description:"最先发现火龙果失踪，并自行询问过其他员工。"},
    {id:"P-003",name:"前台",role:"内部人员",description:"掌握快递、访客和事务所人员进出情况。"},
    {id:"P-004",name:"调查员",role:"内部人员",description:"声称案发时一直在认真工作。"},
    {id:"P-005",name:"实习生",role:"内部人员",description:"对本案表现出了不符合事件规模的认真。"}
  ],
  interviews: [
    {time:"第一轮",title:"报案人自行询问记录",content:"由报案人自己进行，可能存在诱导性提问和遗漏。"},
    {time:"第二轮",title:"负责人访谈记录",content:"由谢楠重新询问相关人员，重点核实行动路线。"},
    {time:"待解锁",title:"补充访谈",content:"查看关键证据后可以继续补充。"}
  ],
  timeline: [
    {time:"09:00",event:"事务所开始办公。"},
    {time:"09:30",event:"火龙果最后一次被确认仍在原处。"},
    {time:"10:15",event:"报案人发现火龙果失踪。"},
    {time:"10:32",event:"谢楠建立 CASE 001 档案。"},
    {time:"待确认",event:"火龙果被移动的具体经过仍待调查。"}
  ]
};
