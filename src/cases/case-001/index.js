window.detectiveCases = window.detectiveCases || {};
window.detectiveCases['case-001'] = {
  manifest: {
    id: 'case-001',
    version: 1,
    title: '消失的火龙果',
    number: 'DN-001',
    status: 'published',
    initiallyAccepted: true,
    entryMailId: 'case-001-request'
  },
  mails: [
    {
      id: 'case-001-request',
      from: '陈凯琳 <grace91@omail.com>',
      subject: '紧急委托：请帮我找到偷吃火龙果的家伙！',
      receivedAt: '今天 17:30',
      preview: '亲爱的侦探：你好，我有一个紧急事件需要你的帮助……',
      body: '亲爱的侦探：\n\n你好，我有一个紧急事件需要你的帮助，希望你能调查一起离奇的火龙果消失事件。\n\n今天下午3:30，我在楼下便利店买了一个火龙果，回家后就把它放进了冰箱。当时，家里有一位室友正在浴室洗澡。\n\n之后，我去了主卧的浴室洗澡。等我洗完澡出来时，室友已经不在家了，但我没留意火龙果还在不在，因为我收到朋友信息，忙着去马栏山博物馆参加活动。\n\n下午4:15，我离开家前往博物馆。\n\n下午5:15，我参加完活动和朋友一起回家。一回家我就发现火龙果不见了，垃圾桶里还有火龙果皮，我怀疑有人偷吃了我的火龙果！\n\n当时家里只有三个人：我的室友徐洁儿、黄灿灿，以及隔壁邻居张月。我认为火龙果小偷应该就在这三个人之中！\n\n我把目前我能提供的线索整理出来了，你可以从这个链接里下载：https://cloud.omail.com/share/grace91-case001\n\n这个火龙果对我非常重要，希望你能查明真相找出凶手。拜托你了，侦探！\n\n委托人 陈凯琳',
      direction: 'received'
    },
    {
      id: 'mail-placeholder-001',
      from: '搜兔张朝月 <sotoozhangchaoyue@omail.com>',
      subject: '关于赞助合作的会面邀请',
      receivedAt: '05/26',
      preview: '您好，我们对贵团队正在筹备的综艺项目十分感兴趣，希望进一步了解项目内容……',
      body: '谢楠：\n\n这是一封待编辑的占位邮件，具体内容可在后续替换。\n\n张朝月',
      direction: 'received'
    },
    {
      id: 'mail-placeholder-002',
      from: 'Taylor&Francis <zhouyuan@omail.com>',
      subject: '填30秒问卷，抽B站大会员',
      receivedAt: '03/21',
      preview: '即刻参与调研，赢取惊喜好礼！',
      body: '谢楠：\n\n这是一封待编辑的占位邮件，具体内容可在后续替换。\n\n周远',
      direction: 'received'
    },
    {
      id: 'mail-placeholder-003',
      from: 'Banana <advertisement@banana.com>',
      subject: '<广告> 各款bPhone 17 Pro新配件，配出各式精彩',
      receivedAt: '02/23',
      preview: '全面装备起来  全新bPhone 17 Pro 精选配件，等你一探究竟……',
      body: '谢楠：\n\n这是一封待编辑的占位邮件，具体内容可在后续替换。\n\n许言',
      direction: 'received'
    },
    {
      id: 'mail-placeholder-004',
      from: '马栏山社区服务中心 <service@malanshan.local>',
      subject: '社区活动通知',
      receivedAt: '01/20',
      preview: '本月社区活动安排已经发布，请查收……',
      body: '谢楠：\n\n这是一封待编辑的占位邮件，具体内容可在后续替换。\n\n马栏山社区服务中心',
      direction: 'received'
    }
  ],
  database: {
    summary: '委托人陈凯琳请求调查家中火龙果失踪事件，嫌疑人为徐洁儿、黄灿灿和张月。',
    people: [
      { name: '陈凯琳', role: '委托人', detail: '火龙果的购买者与失主。' },
      { name: '徐洁儿', role: '嫌疑人', detail: '案发时曾在委托人家中。' },
      { name: '黄灿灿', role: '嫌疑人', detail: '案发时曾在委托人家中。' },
      { name: '张月', role: '嫌疑人', detail: '委托人的隔壁邻居。' }
    ],
    timeline: [
      { time: '2026/06/27 15:30', detail: '陈凯琳购买一颗全糖红心火龙果。' },
      { time: '2026/06/27 16:15', detail: '陈凯琳离家前往马栏山博物馆。' },
      { time: '2026/06/27 17:15', detail: '陈凯琳回家后发现火龙果失踪。' }
    ]
  }
};
