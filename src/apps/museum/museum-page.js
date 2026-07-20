(function () {
  const content = document.querySelector('#museumContent');
  const views = {
    classroom: `<section class="museum-hero"><div class="museum-hero-copy"><small>传统工艺 · 公益体验</small><h2>金银细工<br>非遗课堂</h2><p>在錾刻与锤揲之间，触摸金属留下的温度。由非遗工艺教师带领，认识金银细工的传统纹样与基础技法。</p><div class="museum-event-time"><span>活动时间</span><b>2026/06/27　16:30</b><em>二层传统工艺教室</em></div><button>查看活动须知</button></div><div class="museum-metal-art"><span>银</span><i></i><b>细工</b></div></section><section class="museum-features"><article><b>纹样识读</b><p>认识卷草、如意与云雷纹的构成。</p></article><article><b>錾刻体验</b><p>在指导下完成一枚基础金属纹样片。</p></article><article><b>工艺档案</b><p>了解马栏山地区金银细工的传承故事。</p></article></section>`,
    guides: `<section class="museum-inner"><header><small>VISITOR SERVICE</small><h2>讲解员介绍与预约</h2><p>选择讲解员与参观时段，预约展厅导览服务。</p></header><div class="guide-grid"><article class="guide-card muted"><div class="guide-avatar">侯</div><div><h3>侯宇</h3><span>传统工艺展厅讲解员</span><p>擅长京剧艺术、地方民俗与馆藏器物讲解。讲解细致，适合首次参观及亲子观众。</p><b>今日预约已满</b></div><button>已约满</button></article><article class="guide-card"><div class="guide-avatar">林</div><div><h3>林珂</h3><span>金银细工专题讲解员</span><p>长期负责传统金属工艺专题导览，擅长介绍錾刻、锤揲与纹样设计。</p><b>可预约时段：14:30 / 16:00</b></div><button>预约</button></article><article class="guide-card"><div class="guide-avatar">陈</div><div><h3>陈叙</h3><span>地方历史展厅讲解员</span><p>主要讲解马栏山地方史、民俗生活与近现代城市变迁。</p><b>可预约时段：15:30 / 16:00</b></div><button>预约</button></article><article class="guide-card"><div class="guide-avatar">许</div><div><h3>许文</h3><span>公众教育讲解员</span><p>擅长面向亲子观众和学生团体开展互动式馆藏导览。</p><b>可预约时段：13:30 / 16:30</b></div><button>预约</button></article></div></section>`,
    exhibitions: `<section class="museum-inner"><header><small>EXHIBITIONS</small><h2>展览资讯</h2></header><div class="museum-placeholder">常设展与专题展信息正在整理中。</div></section>`,
    visit: `<section class="museum-inner"><header><small>PLAN YOUR VISIT</small><h2>参观指南</h2></header><div class="museum-placeholder">开放时间 09:00—18:00，17:30 停止入馆。</div></section>`
  };
  function show(tab) {
    content.innerHTML = views[tab];
    if (tab === 'guides') {
      const houyuAvatar = content.querySelector('.guide-card .guide-avatar');
      if (houyuAvatar) {
        houyuAvatar.classList.add('guide-avatar-image');
        houyuAvatar.innerHTML = '<img src="./src/assets/placeholders/museum-houyu-avatar.webp" alt="侯宇头像待替换图片">';
      }
      content.querySelector('.guide-grid').insertAdjacentHTML('beforeend', `<article class="guide-card muted"><div class="guide-avatar">周</div><div><h3>周闻</h3><span>历史文化展厅讲解员</span><p>主要负责马栏山地方史与近现代专题展览。</p><b>今日预约已满</b></div><button>已约满</button></article>`);
    }
    document.querySelectorAll('[data-museum-tab]').forEach(button => button.classList.toggle('active', button.dataset.museumTab === tab));
  }
  document.querySelectorAll('[data-museum-tab]').forEach(button => {
    if (button.dataset.museumTab === 'classroom' || button.dataset.museumTab === 'guides') {
      button.addEventListener('click', () => show(button.dataset.museumTab));
    }
  });
  show('classroom');
})();
