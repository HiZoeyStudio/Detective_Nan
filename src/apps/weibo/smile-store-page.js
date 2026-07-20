(function () {
  const feed = document.querySelector('.weibo-feed');
  const latest = feed && feed.querySelector('.weibo-post');
  if (!feed || !latest) return;

  const icons = {
    repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5H4v15h15v-5"/><path d="M12 3h9v9M21 3l-11 11"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v13H9l-4 3v-3H4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20H4V9h4zM8 10l4-7c2 0 3 1.5 2 4l-.5 2H20c1 0 1.5 1 1.2 2l-2 8c-.2.7-.8 1-1.5 1H8z"/></svg>'
  };

  function actions(reposts, comments, likes) {
    return `<footer class="weibo-post-actions"><button>${icons.repost}<span class="action-count">${reposts}</span></button><button>${icons.comment}<span class="action-count">${comments}</span></button><button>${icons.like}<span class="action-count">${likes}</span></button></footer>`;
  }

  latest.querySelector('small').textContent = '今天 16:17 · 来自旧浪微博网页版';
  const oldImage = latest.querySelector(':scope > img');
  document.querySelectorAll('.blank-avatar img').forEach(image => { image.src = './src/assets/placeholders/smile-store-avatar.webp'; });
  if (oldImage) oldImage.outerHTML = '<div class="weibo-photo-grid"><div class="weibo-photo-placeholder" style="background-image:url(\'./src/assets/placeholders/smile-store-dragonfruit-1.webp\')!important"></div><div class="weibo-photo-placeholder" style="background-image:url(\'./src/assets/placeholders/smile-store-dragonfruit-2.webp\')!important"></div></div>';
  document.querySelectorAll('.weibo-photo-placeholder').forEach(element => {
    element.classList.add('weibo-clickable-photo');
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    const openImage = () => {
      const source = getComputedStyle(element).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
      if (!source) return;
      let viewer = document.querySelector('.weibo-photo-viewer');
      if (!viewer) {
        viewer = document.createElement('button');
        viewer.className = 'weibo-photo-viewer';
        viewer.type = 'button';
        viewer.setAttribute('aria-label', '关闭图片预览');
        viewer.innerHTML = '<img alt="火龙果微博图片">';
        viewer.addEventListener('click', () => viewer.hidden = true);
        document.body.append(viewer);
      }
      viewer.querySelector('img').src = source;
      viewer.hidden = false;
    };
    element.addEventListener('click', openImage);
    element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openImage(); } });
  });
  latest.querySelector('footer').outerHTML = actions('2', '12', '31');

  const posts = [
    ['06-23', '祝我的迪士尼公主，永远美丽幸福。', '3', '12', '86'],
    ['04-28', '第一次吃到了公家的火锅，好激动啊！好开心啊！', '3', '9', '33'],
    ['2025-12-25', '和小冉姐找濛姐过圣诞去了，明天见。', '2', '5', '37'],
    ['2025-05-31', '幸福就是一起包包粽子，饿了有地道的咖喱鸡，红烧肉，以及一起闹，一起笑的可爱姐姐们', '4', '11', '73'],
    ['2025-05-24', '不是说好的要顶峰相见，怎么最后还是回来开便利店？', '16', '8', '62']
  ];
  const postMarkup = posts.map(([time, text, reposts, comments, likes]) => `<article class="weibo-post smile-store-older"><div class="weibo-post-head"><div class="weibo-mini-avatar blank-avatar"><img src="./src/assets/placeholders/smile-store-avatar.webp" alt="头像占位图"></div><div><b>马栏山微笑便利店</b><small>${time} · 来自旧浪微博网页版</small></div><button>•••</button></div><p>${text}</p>${actions(reposts, comments, likes)}</article>`).join('');
  latest.insertAdjacentHTML('afterend', postMarkup);
})();
