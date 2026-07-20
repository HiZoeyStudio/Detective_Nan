(function () {
  const gracePost = document.createElement('article');
  gracePost.className = 'cr-post';
  gracePost.innerHTML = '<header><div class="cr-post-avatar grace"><img class="placeholder-avatar-image" src="./src/assets/placeholders/cr-grace-avatar.webp" alt="陈凯琳Grace头像占位图"></div><div><b>陈凯琳Grace</b><small>今天 09:52 · 金卡会员</small></div><button>•••</button></header><p>跳Disco还得找专业的老师/爸</p><button class="cr-video-placeholder" style="background-image:url(\'./src/assets/placeholders/cr-grace-video\.webp\')!important" type="button" aria-label="播放陈凯琳Grace发布的视频"><i>▶</i><small>00:24</small></button><footer><button>♡ 赞 18</button><button>◇ 评论 4</button><button>↗ 分享</button></footer>';
  document.querySelector('.cr-feed .cr-post').insertAdjacentElement('afterend', gracePost);
  const graceMedia = gracePost.querySelector('.cr-video-placeholder');
  if (graceMedia) {
    graceMedia.className = 'cr-feed-photo cr-grace-photo';
    graceMedia.setAttribute('aria-label', '查看陈凯琳发布的照片');
    graceMedia.removeAttribute('style');
    graceMedia.innerHTML = '<img src="./src/assets/placeholders/cr-grace-photo.webp" alt="陈凯琳动态照片待替换图片">';
  }

  const zhangPhotoSource = './src/assets/placeholders/cr-zhang-yue-tea-photo.webp';
  const zhangPhotoBlock = document.querySelector('.cr-feed .cr-post .cr-blank-photo');
  if (zhangPhotoBlock) {
    const zhangPhoto = document.createElement('button');
    zhangPhoto.className = 'cr-feed-photo cr-zhang-photo';
    zhangPhoto.type = 'button';
    zhangPhoto.setAttribute('aria-label', '查看张月发布的照片');
    zhangPhoto.innerHTML = `<img src="${zhangPhotoSource}" alt="张月今日下午茶照片">`;
    zhangPhotoBlock.replaceWith(zhangPhoto);
  }

  function openPhotoViewer(source, alt) {
    let viewer = document.querySelector('.cr-photo-viewer');
    if (!viewer) {
      viewer = document.createElement('button');
      viewer.className = 'cr-photo-viewer';
      viewer.type = 'button';
      viewer.setAttribute('aria-label', '关闭照片预览');
      viewer.innerHTML = '<img alt="">';
      viewer.addEventListener('click', () => viewer.hidden = true);
      document.body.append(viewer);
    }
    const image = viewer.querySelector('img');
    image.src = source;
    image.alt = alt;
    viewer.hidden = false;
  }

  function bindFeedPhotos() {
    document.querySelectorAll('.cr-feed-photo').forEach(photo => photo.addEventListener('click', () => {
      const image = photo.querySelector('img');
      openPhotoViewer(image.src, image.alt);
    }));
  }
  bindFeedPhotos();
  const actionIcons = {
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20H4V9h4zM8 10l4-7c2 0 3 1.5 2 4l-.5 2H20c1 0 1.5 1 1.2 2l-2 8c-.2.7-.8 1-1.5 1H8z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v13H9l-4 3v-3H4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5H4v15h15v-5"/><path d="M12 3h9v9M21 3l-11 11"/></svg>'
  };
  document.querySelectorAll('.cr-post>footer button').forEach(button => {
    const label = button.textContent.replace(/^[♡◇↗]\s*/, '').trim();
    const type = label.includes('赞') ? 'like' : label.includes('评论') ? 'comment' : 'share';
    button.classList.add('cr-action-button');
    button.innerHTML = `${actionIcons[type]}<span>${label}</span>`;
  });
  const login = document.querySelector('#crLoginView');
  const member = document.querySelector('#crMemberView');
  const error = document.querySelector('#crLoginError');
  const id = document.querySelector('#crMemberId');
  const password = document.querySelector('#crPassword');
  document.querySelector('#crLoginForm').addEventListener('submit', event => {
    event.preventDefault();
    if (id.value === 'AngelicaLee' && password.value === '19760123') {
      localStorage.setItem('cr-member-authenticated-v2', 'AngelicaLee');
      error.hidden = true; login.hidden = true; member.hidden = false; window.scrollTo(0, 0);
    } else {
      error.hidden = false; password.value = ''; password.focus();
    }
  });
  document.querySelector('#crLogout').addEventListener('click', () => {
    localStorage.removeItem('cr-member-authenticated-v2');
    member.hidden = true; login.hidden = false; password.value = ''; error.hidden = true; id.focus();
  });

  localStorage.removeItem('cr-member-authenticated');
  if (localStorage.getItem('cr-member-authenticated-v2') === 'AngelicaLee') {
    login.hidden = true;
    member.hidden = false;
  }

  const memberShell = document.querySelector('.cr-member-shell');
  const memberNavButtons = Array.from(memberShell.querySelectorAll(':scope>aside:first-child nav button'));
  const homeButton = memberNavButtons.find(button => button.textContent.trim() === '动态首页');
  const trainingButton = memberNavButtons.find(button => button.textContent.trim() === '训练记录');
  const feed = memberShell.querySelector('.cr-feed');
  const sidebar = memberShell.querySelector('.cr-sidebar');
  const homeMarkup = feed.innerHTML;

  function setActiveNav(activeButton) {
    memberNavButtons.forEach(button => button.classList.toggle('active', button === activeButton));
  }

  function showTrainingRecords() {
    setActiveNav(trainingButton);
    memberShell.classList.add('cr-training-mode');
    sidebar.hidden = true;
    feed.innerHTML = `<section class="cr-training-detail"><header><div><small>TRAINING RECORDS</small><h1>训练记录详情</h1><p>金卡会员 AngelicaLee · 数据更新于 2026/06/27 17:45</p></div><span>私人教练：徐梦洁</span></header><section class="cr-training-summary"><article><span>本月训练</span><strong>8<small>次</small></strong></article><article><span>累计时长</span><strong>9.7<small>小时</small></strong></article><article><span>消耗热量</span><strong>4,632<small>kcal</small></strong></article><article><span>完成率</span><strong>92<small>%</small></strong></article></section><section class="cr-training-record-card"><header><h2>近期训练明细</h2><button type="button" aria-disabled="true">导出记录</button></header><div class="cr-training-record-table"><div class="head"><span>训练日期</span><span>训练项目</span><span>教练</span><span>训练时长</span><span>消耗热量</span><span>状态</span></div><div><time>2026/06/25 15:00</time><b>下肢力量训练</b><span>徐梦洁</span><span>75分钟</span><span>486 kcal</span><em>已完成</em></div><div><time>2026/06/21 18:30</time><b>核心稳定训练</b><span>徐梦洁</span><span>60分钟</span><span>352 kcal</span><em>已完成</em></div><div><time>2026/06/17 10:00</time><b>体能循环训练</b><span>徐梦洁</span><span>90分钟</span><span>628 kcal</span><em>已完成</em></div><div><time>2026/06/14 19:15</time><b>跑步机有氧</b><span>自主训练</span><span>45分钟</span><span>317 kcal</span><em>已完成</em></div><div><time>2026/06/11 16:30</time><b>上肢力量训练</b><span>徐梦洁</span><span>70分钟</span><span>429 kcal</span><em>已完成</em></div><div><time>2026/06/07 18:00</time><b>臀腿塑形训练</b><span>徐梦洁</span><span>80分钟</span><span>511 kcal</span><em>已完成</em></div><div><time>2026/06/02 11:20</time><b>椭圆机有氧</b><span>自主训练</span><span>50分钟</span><span>338 kcal</span><em>已完成</em></div><div><time>2026/06/01 17:30</time><b>全身功能训练</b><span>徐梦洁</span><span>75分钟</span><span>472 kcal</span><em>已完成</em></div></div></section></section>`;
  }

  function showMemberFeed() {
    setActiveNav(homeButton);
    memberShell.classList.remove('cr-training-mode');
    sidebar.hidden = false;
    feed.innerHTML = homeMarkup;
    bindFeedPhotos();
  }

  trainingButton?.addEventListener('click', showTrainingRecords);
  homeButton?.addEventListener('click', showMemberFeed);
})();
