(function () {
  const host = document.querySelector('[data-shared-taskbar]');
  if (!host) return;
  host.className = 'taskbar shared-page-taskbar';
  host.innerHTML = `<button class="start-button" aria-label="开始"><span></span><span></span><span></span><span></span></button><form class="search-box shared-search-form"><span>⌕</span><input autocomplete="off" placeholder="搜索..."><button type="submit" aria-label="搜索">→</button></form><div class="taskbar-apps"><button class="shared-open-mail" aria-label="Omail"><img src="./src/assets/outlook.svg" alt=""></button><button class="shared-open-edge" aria-label="Macrosoft Edge"><img src="./src/assets/microsoft-edge.svg" alt=""></button></div><div class="system-tray"><button class="tray-decoy tray-arrow">⌃</button><button class="tray-decoy tray-clock"><time class="shared-clock"></time></button></div>`;
  const mailTaskbarButton = host.querySelector('.shared-open-mail');
  const edgeTaskbarButton = host.querySelector('.shared-open-edge');
  edgeTaskbarButton.classList.add('taskbar-active');
  const openEdge = query => window.open(`./edge-search.html${query ? `?q=${encodeURIComponent(query)}` : ''}`, '_blank', 'noopener');
  host.querySelector('.shared-search-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const query = form.querySelector('input').value.trim();
    const key = query.toLowerCase();
    const hasMatch = (window.nanSearchIndex || []).some(item => item.keywords.some(word => word.toLowerCase() === key));
    if (!hasMatch) {
      form.querySelector('.taskbar-search-popup')?.remove();
      const popup = document.createElement('div');
      popup.className = 'taskbar-search-popup';
      popup.textContent = '未找到匹配结果';
      form.append(popup);
      return;
    }
    openEdge(query);
  });
  host.querySelector('.shared-search-form input').addEventListener('input', event => {
    const form = event.currentTarget.closest('form');
    const key = event.currentTarget.value.trim().toLowerCase();
    const hasMatch = !!key && (window.nanSearchIndex || []).some(item => item.keywords.some(word => word.toLowerCase() === key));
    form.querySelector('.taskbar-search-popup')?.remove();
    if (!key) return;
    if (key && !hasMatch) {
      const popup = document.createElement('div'); popup.className = 'taskbar-search-popup'; popup.textContent = '未找到匹配结果'; form.append(popup);
    }
  });
  host.querySelector('.shared-open-edge').addEventListener('click', () => openEdge(''));
  host.querySelector('.shared-open-mail').addEventListener('click', () => window.open('./desktop.html?app=mail', '_blank', 'noopener'));
  function updateClock() { host.querySelector('.shared-clock').textContent = '17:45\n2026/06/27'; }
  updateClock();
  if (location.pathname.toLowerCase().endsWith('/weibo-dandan-dancey.html')) {
    const feed = document.querySelector('.weibo-feed');
    if (feed) {
      const post = document.createElement('article');
      post.className = 'weibo-post dancey-roommate-post';
      post.innerHTML = '<div class="weibo-post-head"><div class="weibo-mini-avatar dancey-avatar">淡</div><div><b>淡淡Dancey</b><small>5天前 19:26 · 来自微博网页版</small></div><button>•••</button></div><p>室友咬人了！</p><footer><button>↗ 转发</button><button>◇ 评论 1</button><button>♡ 赞</button></footer><section class="dancey-inline-comments"><article><span class="weibo-comment-avatar">桃</span><div><b>桃子汽水</b><p>室友是谁啊好漂亮</p><small>5天前 19:40</small><section><span class="weibo-comment-avatar dancey-avatar">淡</span><div><b>淡淡Dancey <i>博主</i></b><p>是CR健身俱乐部的张月，欢迎找她当教练~</p><small>5天前 19:43</small></div></section></div></article></section>';
      post.querySelector('.weibo-post-head small').textContent = '03-21 · 来自 bPhone 17 Pro Max';
      const roommateCommentTimes = post.querySelectorAll('.dancey-inline-comments small');
      if (roommateCommentTimes[0]) roommateCommentTimes[0].textContent = '03-21';
      if (roommateCommentTimes[1]) roommateCommentTimes[1].textContent = '03-21';
      const video = document.createElement('button');
      video.className = 'weibo-roommate-video'; video.type = 'button'; video.setAttribute('aria-label', '播放室友视频');
      video.innerHTML = '<span>视频待替换</span><i>▶</i><small>00:12</small>';
      post.insertBefore(video, post.querySelector('footer'));
      const commentButton = post.querySelector('footer button:nth-child(2)');
      const commentPanel = post.querySelector('.dancey-inline-comments');
      commentPanel.hidden = true;
      let wechatNotificationSoundPlayed = false;
      commentButton.addEventListener('click', () => {
        commentPanel.hidden = !commentPanel.hidden;
        commentButton.classList.toggle('active', !commentPanel.hidden);
        if (!commentPanel.hidden && !document.querySelector('.wechat-story-alert')) {
          const alert = document.createElement('div');
          alert.className = 'wechat-story-alert'; alert.tabIndex = 0;
          alert.innerHTML = '<div class="wechat-alert-popover"><div class="wechat-alert-main"><span class="wechat-alert-avatar">凯</span><b>凯琳</b><span class="wechat-alert-count" aria-label="2条未读消息">2</span></div><div class="wechat-alert-dismiss">暂不处理</div></div><button class="wechat-alert-icon" type="button" aria-label="微信新消息"><span></span><i></i></button>';
          alert.querySelector('.wechat-alert-avatar').innerHTML = '<img src="./src/assets/placeholders/wechat-kailin-avatar.webp" alt="凯琳头像占位图">';
          const alertPopover = alert.querySelector('.wechat-alert-popover');
          alertPopover.style.setProperty('bottom', '40px', 'important');
          host.querySelector('.tray-arrow').insertAdjacentElement('afterend', alert);
          if (!wechatNotificationSoundPlayed) {
            wechatNotificationSoundPlayed = true;

            const notificationAudio = new Audio(
              './src/assets/audio/wechat-notification.mp3'
            );

            notificationAudio.volume = 0.7;
            notificationAudio.play().catch(error => {
              console.warn('微信消息提示音播放失败：', error);
            });
          }
          alert.addEventListener('mouseenter', () => alert.classList.add('notification-seen'), { once: true });
          let alertHideTimer;
          alert.addEventListener('mouseenter', () => {
            clearTimeout(alertHideTimer);
            if (!alert.classList.contains('chat-opened')) alert.classList.add('popup-visible');
          });
          alert.addEventListener('mouseleave', () => {
            clearTimeout(alertHideTimer);
            alertHideTimer = setTimeout(() => alert.classList.remove('popup-visible'), 280);
          });
          alert.querySelector('.wechat-alert-icon').addEventListener('click', () => alert.querySelector('.wechat-alert-main').click());
          alert.querySelector('.wechat-alert-main').addEventListener('click', () => {
            alert.classList.add('chat-opened'); alert.classList.remove('popup-visible'); clearTimeout(alertHideTimer);
            alertPopover.style.setProperty('display', 'none', 'important');
            alert.querySelector('.wechat-alert-icon i')?.remove();
            let chat = document.querySelector('.wechat-chat-window');
            if (!chat) {
              chat = document.createElement('section');
              chat.className = 'wechat-chat-window';
              chat.innerHTML = '<header><div><span class="wechat-window-logo">微信</span><b>微信</b></div><nav><button type="button" aria-label="最小化">—</button><button type="button" aria-label="最大化">□</button><button type="button" class="wechat-window-close" aria-label="关闭">×</button></nav></header><div class="wechat-window-body"><aside><label><span>⌕</span><input type="text" placeholder="搜索"></label><small>置顶聊天</small><div class="wechat-chat-item pinned"><span>楠</span><div><b>有楠必解事务所</b><p>凯琳：我发给楠姐了！</p></div><i>置顶</i></div><div class="wechat-chat-item pinned"><span>鸡</span><div><b>By5香鸡</b><p>灿灿：[动画表情]</p></div><i>置顶</i></div><div class="wechat-chat-item active"><span>凯</span><div><b>凯琳</b><p>找到偷吃火龙果的人了吗</p></div></div></aside><main><header><b>凯琳</b><small>…</small></header><section class="wechat-messages"><time>今天 21:07</time><article><span>凯</span><p>楠姐</p></article><article><span>凯</span><p>找到偷吃火龙果的人了吗</p></article></section><footer><div><button>☺</button><button>▣</button><button>▤</button></div><textarea aria-label="输入消息"></textarea><button>发送</button></footer></main></div>';
              const chatItems = chat.querySelectorAll('.wechat-chat-item');
              chat.querySelectorAll('.wechat-chat-item.pinned>i').forEach(label => label.remove());
              ['17:32', '16:58', '17:45'].forEach((time, index) => { chatItems[index].insertAdjacentHTML('beforeend', `<aside class="wechat-chat-meta"><time>${time}</time></aside>`); });
              chatItems[0].querySelector(':scope>span').innerHTML = '<img src="./src/assets/placeholders/wechat-younan-group-avatar.webp" alt="有楠必解事务所群头像占位图">';
              chatItems[1].querySelector(':scope>span').innerHTML = '<img src="./src/assets/placeholders/wechat-by5-group-avatar.webp" alt="By5香鸡群头像占位图">';
              chatItems[2].querySelector(':scope>span').innerHTML = '<img src="./src/assets/placeholders/wechat-kailin-avatar.webp" alt="凯琳头像占位图">';
              const windowBody = chat.querySelector('.wechat-window-body');
              windowBody.insertAdjacentHTML('afterbegin', '<nav class="wechat-app-rail"><button class="active wechat-rail-chat" type="button" aria-label="聊天"><svg viewBox="0 0 32 32"><ellipse cx="13" cy="17" rx="9" ry="7"/><path d="m7 22-1 4 5-3"/><ellipse cx="20" cy="10" rx="9" ry="7"/><path d="m26 15 1 4-5-3"/></svg><i>3</i></button><button type="button" aria-label="通讯录"><svg viewBox="0 0 32 32"><circle cx="13" cy="11" r="5"/><path d="M3 27c1-7 5-10 10-10s9 3 10 10M23 10h6M25 14h4M24 18h5"/></svg></button><button type="button" aria-label="小程序盒子"><svg viewBox="0 0 32 32"><path d="m16 3 11 6-11 6L5 9zM5 9v13l11 7 11-7V9M16 15v14"/></svg></button><button type="button" aria-label="工具"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12"/><path d="M16 4v24M4 16h24M7.5 7.5l17 17M24.5 7.5l-17 17"/><circle cx="16" cy="16" r="5"/></svg></button><button type="button" aria-label="小程序"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12"/><path d="M11 18c-4-2-2-7 1-7 5 0 2 10 7 10 3 0 5-5 1-7"/></svg></button><span></span></nav>');
              const appRail = windowBody.querySelector('.wechat-app-rail');
              appRail.querySelector('.wechat-rail-chat>i')?.remove();
              appRail.insertAdjacentHTML('afterbegin', '<img src="./src/assets/placeholders/wechat-xienan-avatar.webp" alt="谢楠头像占位图">');
              appRail.insertAdjacentHTML('beforeend', '<button type="button" aria-label="手机"><svg viewBox="0 0 32 32"><rect x="9" y="3" width="14" height="26" rx="2"/><path d="M14 25h4"/></svg></button><button class="wechat-rail-menu" type="button" aria-label="菜单"><svg viewBox="0 0 32 32"><path d="M5 9h22M5 16h22M5 23h22"/></svg><i></i></button>');
              const conversationAside = windowBody.querySelector(':scope>aside');
              conversationAside.insertAdjacentHTML('afterbegin', '<button class="wechat-add-chat" type="button" aria-label="新建聊天">＋</button>');
              chat.querySelectorAll('.wechat-messages>article span').forEach(avatar => { avatar.innerHTML = '<img src="./src/assets/placeholders/wechat-kailin-avatar.webp" alt="凯琳头像占位图">'; });
              const inputTools = chat.querySelector('.wechat-window-body>main>footer>div');
              inputTools.className = 'wechat-input-tools';
              inputTools.innerHTML = '<button type="button" aria-label="表情"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8 15c2 2 6 2 8 0"/></svg></button><button type="button" aria-label="小程序"><svg viewBox="0 0 24 24"><path d="m12 3 8 5-8 5-8-5zM4 8v8l8 5 8-5V8M12 13v8"/></svg></button><button type="button" aria-label="发送文件"><svg viewBox="0 0 24 24"><path d="M3 7h7l2 2h9v11H3zM3 7V4h8l2 3"/></svg></button><button type="button" aria-label="截图"><svg viewBox="0 0 24 24"><path d="m5 4 14 16M19 4 5 20"/><circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/></svg></button><button type="button" aria-label="更多">⌄</button><span></span><button type="button" aria-label="语音通话"><svg viewBox="0 0 24 24"><path d="M7 3 4 5c0 8 7 15 15 15l2-3-5-3-2 2c-3-1-5-3-6-6l2-2z"/></svg></button><button type="button" aria-label="视频通话"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg></button>';
              inputTools.querySelector('[aria-label="截图"]').remove();
              inputTools.querySelector('[aria-label="更多"]').remove();
              document.body.append(chat);
              const appButton = document.createElement('button');
              appButton.className = 'shared-open-wechat taskbar-active'; appButton.type = 'button'; appButton.setAttribute('aria-label', '微信');
              appButton.innerHTML = '<span class="taskbar-wechat-mark"></span>';
              host.querySelector('.taskbar-apps').append(appButton);
              edgeTaskbarButton.classList.remove('taskbar-active');
              appButton.addEventListener('click', () => { chat.classList.remove('minimized'); appButton.classList.add('taskbar-active'); edgeTaskbarButton.classList.remove('taskbar-active'); });
              chat.querySelector('.wechat-window-close').addEventListener('click', () => { chat.remove(); appButton.remove(); edgeTaskbarButton.classList.add('taskbar-active'); });
              chat.querySelector('header nav button:first-child').addEventListener('click', () => chat.classList.add('minimized'));
              chat.querySelector('.wechat-window-logo').addEventListener('click', () => chat.classList.remove('minimized'));
              const kailinItem = chat.querySelector('.wechat-chat-item.active');
              const messages = chat.querySelector('.wechat-messages');
              messages.querySelector('time').textContent = '17:45';
              const textarea = chat.querySelector('textarea');
              const sendButton = chat.querySelector('.wechat-window-body>main>footer>button');
              const chatTitle = chat.querySelector('.wechat-window-body>main>header>b');
              chatTitle.nextElementSibling?.remove();
              const dragHandle = chat.querySelector('.wechat-window-body>main>header');
              dragHandle.addEventListener('pointerdown', event => {
                if (event.button !== 0) return;
                const rect = chat.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;
                chat.style.left = `${rect.left}px`; chat.style.top = `${rect.top}px`; chat.style.transform = 'none';
                dragHandle.setPointerCapture(event.pointerId);
                const move = moveEvent => {
                  const maxLeft = Math.max(0, window.innerWidth - chat.offsetWidth);
                  const maxTop = Math.max(0, window.innerHeight - 40 - chat.offsetHeight);
                  chat.style.left = `${Math.max(0, Math.min(maxLeft, moveEvent.clientX - offsetX))}px`;
                  chat.style.top = `${Math.max(0, Math.min(maxTop, moveEvent.clientY - offsetY))}px`;
                };
                const stop = () => { dragHandle.removeEventListener('pointermove', move); dragHandle.removeEventListener('pointerup', stop); dragHandle.removeEventListener('pointercancel', stop); };
                dragHandle.addEventListener('pointermove', move); dragHandle.addEventListener('pointerup', stop); dragHandle.addEventListener('pointercancel', stop);
              });
              let wrongAnswers = 0;
              let failureWarningShown = false;
              let mysterySolved = false;
              let truthDialogShown = false;
              let currentContact = '凯琳';
              const kailinHistory = [
                { from: '凯琳', text: '楠姐' },
                { from: '凯琳', text: '找到偷吃火龙果的人了吗' }
              ];
              const appendMessage = (from, text) => {
                const row = document.createElement('article');
                row.className = from === '我' ? 'wechat-message-self' : '';
                const avatarFile = from === '我' ? 'wechat-xienan-avatar.webp' : from === '灿灿' ? 'wechat-cancan-avatar.webp' : 'wechat-kailin-avatar.webp';
                row.innerHTML = `<span><img src="./src/assets/placeholders/${avatarFile}" alt="${from}头像占位图"></span><p></p>`;
                row.querySelector('p').textContent = text;
                messages.append(row); messages.scrollTop = messages.scrollHeight;
              };
              const showConversation = contact => {
                currentContact = contact; chatTitle.textContent = contact;
                chat.querySelectorAll('.wechat-chat-item').forEach(item => item.classList.toggle('active', item.dataset.contact === contact));
                messages.innerHTML = '<time>17:45</time>';
                const history = contact === '凯琳' ? kailinHistory : [{ from: '灿灿', text: '楠姐快回来 凯琳要拆家了！！！' }];
                history.forEach(item => appendMessage(item.from, item.text));
                textarea.disabled = false; sendButton.disabled = contact !== '凯琳' || mysterySolved;
              };
              kailinItem.dataset.contact = '凯琳'; kailinItem.addEventListener('click', () => showConversation('凯琳'));
              const addCancanChat = () => {
                if (chat.querySelector('[data-contact="灿灿"]')) return;
                const item = document.createElement('div');
                item.className = 'wechat-chat-item wechat-cancan-item'; item.dataset.contact = '灿灿';
                item.innerHTML = '<span>灿</span><div><b>灿灿</b><p>楠姐快回来 凯琳要拆家了！！！</p></div><aside class="wechat-chat-meta"><time>17:45</time><i>1</i></aside>';
                item.querySelector(':scope>span').innerHTML = '<img src="./src/assets/placeholders/wechat-cancan-avatar.webp" alt="灿灿头像占位图">';
                chat.querySelector('.wechat-rail-chat').insertAdjacentHTML('beforeend', '<i>1</i>');
                kailinItem.insertAdjacentElement('beforebegin', item);
                item.addEventListener('click', () => {
                  item.querySelector('i')?.remove();
                  chat.querySelector('.wechat-rail-chat>i')?.remove();
                  showConversation('灿灿');
                  if (!truthDialogShown && !document.querySelector('.case-truth-dialog')) {
                    truthDialogShown = true;
                    const overlay = document.createElement('div');
                    overlay.className = 'case-truth-overlay';
                    overlay.innerHTML = '<section class="case-truth-dialog" role="dialog" aria-modal="true" aria-labelledby="caseTruthTitle"><button class="case-truth-close" type="button" aria-label="关闭">×</button><span>CASE CLOSED</span><h2 id="caseTruthTitle">恭喜！你已经找到真相了~</h2><p>快快回家吃小龙虾（敬请期待第二部吧！）</p><button class="case-truth-confirm" type="button">关闭</button></section>';
                    const closeTruthDialog = () => overlay.remove();
                    overlay.querySelector('.case-truth-close').addEventListener('click', closeTruthDialog);
                    overlay.querySelector('.case-truth-confirm').addEventListener('click', closeTruthDialog);
                    document.body.append(overlay);
                  }
                });
              };
              const sendReply = () => {
                const answer = textarea.value.trim();
                if (!answer || currentContact !== '凯琳' || mysterySolved) return;
                textarea.value = ''; kailinHistory.push({ from: '我', text: answer }); appendMessage('我', answer);
                let reply;
                if (answer === '张月') {
                  wrongAnswers = 0; reply = '！'; addCancanChat();
                  mysterySolved = true; currentContact = '凯琳'; textarea.disabled = false; sendButton.disabled = true;
                } else {
                  wrongAnswers += 1;
                  if (answer === '徐洁儿' || answer === '黄灿灿') reply = '好像不是，你再想想呢？';
                  else if (['王濛','乌兰图雅','范玮琪','李小冉','唐艺昕','侯宇','济云子然妈','李心洁','陈凯琳','你自己'].includes(answer)) reply = '姐！你认真点！';
                  else reply = '啊？';
                }
                kailinHistory.push({ from: '凯琳', text: reply }); appendMessage('凯琳', reply);
                if (wrongAnswers >= 2 && !failureWarningShown) {
                  const warning = '我们事务所好像要完蛋了';
                  kailinHistory.push({ from: '凯琳', text: warning }); appendMessage('凯琳', warning);
                  failureWarningShown = true;
                }
              };
              sendButton.addEventListener('click', sendReply);
              textarea.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendReply(); } });
            }
            chat.classList.remove('minimized');
            host.querySelector('.shared-open-wechat')?.classList.add('taskbar-active');
            edgeTaskbarButton.classList.remove('taskbar-active');
          });
        }
      });
      feed.append(post);
    }
  }
  const weiboLogo = document.querySelector('.weibo-logo');
  if (weiboLogo) {
    weiboLogo.textContent = '旧浪微博';
    if (!document.title.includes('旧浪微博')) {
      const pageName = document.title.replace(/的微博.*$/, '').replace(/｜.*$/, '');
      document.title = `${pageName}｜旧浪微博`;
    }
    const actionIcons = {
      repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5H4v15h15v-5"/><path d="M12 3h9v9M21 3l-11 11"/></svg>',
      comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v13H9l-4 3v-3H4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
      like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20H4V9h4zM8 10l4-7c2 0 3 1.5 2 4l-.5 2H20c1 0 1.5 1 1.2 2l-2 8c-.2.7-.8 1-1.5 1H8z"/></svg>'
    };
    const weiboActionCounts = {
      'weibo-tangyixin': [[2,12,31],[31,12,86],[3,9,33],[9,5,37],[24,11,73],[16,8,62]],
      'weibo-discover': [[3,8,26]],
      'weibo-xu-zhijing': [[12,19,86],[4,7,31],[8,11,59],[1,6,93]],
      'weibo-jiyun-ziranma': [[0,1,2],[0,0,1],[0,3,19]],
      'weibo-ghlchan': [[5,8,26],[2,13,32],[0,6,38],[1,6,23]],
      'weibo-dandan-dancey': [[8,12,67],[14,9,181],[0,34,125],[33,1,236]]
    };
    const currentWeiboPage = location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.weibo-post').forEach(post => {
      if (!post.querySelector(':scope>footer')) {
        post.insertAdjacentHTML('beforeend', '<footer><button type="button">↗ 转发</button><button type="button">◇ 评论</button><button type="button">♡ 赞</button></footer>');
      }
    });
    document.querySelectorAll('.weibo-post').forEach((post, postIndex) => {
      post.querySelectorAll(':scope>footer button').forEach((button, actionIndex) => {
      const original = button.textContent.trim();
      let type = '';
      if (original.includes('转发')) type = 'repost';
      else if (original.includes('评论')) type = 'comment';
      else if (original.includes('赞')) type = 'like';
      if (!type) return;
      const typeLabel = type === 'repost' ? '转发' : type === 'comment' ? '评论' : '赞';
      const existingCount = original.match(/(?:转发|评论|赞)\s*([0-9]+(?:\.[0-9]+)?万?)/)?.[1];
      const mappedCount = weiboActionCounts[currentWeiboPage]?.[postIndex]?.[actionIndex];
      const count = existingCount ?? mappedCount ?? Math.max(0, (postIndex + 1) * (actionIndex + 2));
      const label = String(count) === '0' ? typeLabel : String(count);
      button.classList.add('weibo-action-button');
      button.innerHTML = `${actionIcons[type]}<span>${label}</span>`;
      });
    });
  }
  const rednoteAside = document.querySelector('.rednote-layout>aside');
  if (rednoteAside) {
    rednoteAside.querySelector('nav').innerHTML = '<button class="active"><svg viewBox="0 0 24 24"><path d="M4 9l8-5 8 5v10H4z"/><path d="M9 15h6"/></svg>首页</button><button><svg viewBox="0 0 24 24"><rect x="3" y="6" width="15" height="12" rx="3"/><path d="m18 10 3-2v8l-3-2"/></svg>直播</button><button><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12h8M12 8v8"/></svg>发布</button><button><svg viewBox="0 0 24 24"><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z"/><path d="M10 20h4"/></svg>通知</button><button><svg viewBox="0 0 24 24"><path d="M4 4h16v13H9l-5 4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>消息</button><button><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3"/><path d="M7 19c1-3 3-4 5-4s4 1 5 4"/></svg>我</button>';
    rednoteAside.querySelector('footer').innerHTML = '<button>☰　更多</button><button>ⓘ　关于我们</button>';
    const user = document.querySelector('.rednote-user');
    if (user && !user.querySelector('.rednote-profile-actions')) {
      user.insertAdjacentHTML('beforeend', '<div class="rednote-profile-actions"><button>关注</button><button aria-label="私信">•••</button></div>');
    }
    document.querySelectorAll('.rednote-detail>footer').forEach(footer => {
      footer.classList.add('rednote-detail-actions');
      footer.innerHTML = '<input type="text" placeholder="说点什么…"><button type="button" aria-label="点赞"><svg viewBox="0 0 24 24"><path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5C21 16 12 21 12 21z"/></svg><span>16</span></button><button type="button" aria-label="收藏"><svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg><span>1</span></button><button type="button" aria-label="评论"><svg viewBox="0 0 24 24"><path d="M4 4h16v13H9l-5 4z"/></svg><span>2</span></button><button type="button" aria-label="分享"><svg viewBox="0 0 24 24"><path d="M14 5l7 6-7 6v-4C8 13 5 16 3 20c0-8 4-12 11-12z"/></svg></button>';
      if (location.pathname.toLowerCase().endsWith('/xiaohongshu-acan.html')) footer.querySelector('[aria-label="评论"] span').textContent = '4';
    });
    document.querySelectorAll('.rednote-card footer b').forEach(like => {
      const count = like.textContent.replace('♡', '').trim();
      like.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5C21 16 12 21 12 21z"/></svg><span>${count}</span>`;
    });
  }
  const placeholderRoot = './src/assets/placeholders/';
  const pageName = location.pathname.split('/').pop().replace('.html', '');
  function assignBackground(selector, names) {
    document.querySelectorAll(selector).forEach((element, index) => {
      const name = names[index];
      if (name) element.style.setProperty('background-image', `url("${placeholderRoot}${name}\.webp")`, 'important');
    });
  }
  function assignAvatar(selector, name) {
    document.querySelectorAll(selector).forEach(element => {
      element.textContent = '';
      const image = document.createElement('img');
      image.className = 'placeholder-avatar-image';
      image.src = `${placeholderRoot}${name}\.webp`;
      image.alt = '头像占位图';
      element.append(image);
    });
  }
  function assignAdaptivePhoto(selector, names) {
    document.querySelectorAll(selector).forEach((element, index) => {
      const name = names[index];
      if (!name) return;
      element.classList.add('weibo-adaptive-photo');
      element.style.removeProperty('background-image');
      element.innerHTML = `<img src="${placeholderRoot}${name}\.webp" alt="微博照片待替换图片">`;
    });
  }
  const placeholderPages = {
    'xiaohongshu-acan': () => {
      assignBackground('.blank-note-image', ['acan-note-1','acan-note-2','acan-note-3','acan-note-4','acan-note-5','acan-note-6']);
      assignBackground('.rednote-detail-image', ['acan-note-detail']);
      assignAvatar('.rednote-avatar:not(.lixiaoran-avatar),.rednote-card footer i,.comment-avatar.author', 'acan-avatar');
      assignAvatar('.comment-avatar.li', 'lixiaoran-avatar');
      assignAvatar('.rednote-comments>article:nth-of-type(2)>.comment-avatar', 'xhs-xiatian-avatar');
      assignAvatar('.rednote-comments>article:nth-of-type(3)>.comment-avatar', 'xhs-mili-avatar');
    },
    'xiaohongshu-lixiaoran': () => {
      assignBackground('.blank-note-image', ['lixiaoran-note-1','lixiaoran-note-2','lixiaoran-note-3','lixiaoran-sisters-gathering','lixiaoran-note-5','lixiaoran-note-6']);
      assignBackground('.rednote-detail-image', ['lixiaoran-sisters-gathering-detail']);
      assignAvatar('.rednote-avatar,.rednote-card footer i', 'lixiaoran-avatar');
      assignAvatar('.rednote-comments>article:nth-of-type(1)>.comment-avatar', 'xhs-yunduo-avatar');
      assignAvatar('.rednote-comments>article:nth-of-type(2)>.comment-avatar', 'xhs-anan-avatar');
    },
    'weibo-xu-zhijing': () => { assignAvatar('.xu-avatar', 'xu-zhijing-avatar'); assignAvatar('.jiyun-avatar', 'jiyun-ziranma-avatar'); assignBackground('.weibo-blank-photo', ['xu-zhijing-latest-photo']); assignAvatar('.weibo-comment-panel>article:nth-of-type(2) .weibo-comment-avatar', 'weibo-xiaocheng-avatar'); assignAvatar('.weibo-comment-panel>article:nth-of-type(3) .weibo-comment-avatar', 'weibo-wanfeng-avatar'); },
    'weibo-jiyun-ziranma': () => { assignAvatar('.jiyun-avatar', 'jiyun-ziranma-avatar'); assignBackground('.weibo-blank-photo', ['jiyun-latest-photo']); },
    'weibo-ghlchan': () => { assignAvatar('.ghl-avatar', 'ghlchan-avatar'); assignAvatar('.dancey-avatar', 'dancey-avatar'); assignAdaptivePhoto('.weibo-blank-photo', ['ghlchan-dance-photo']); },
    'weibo-dandan-dancey': () => { assignAvatar('.dancey-avatar', 'dancey-avatar'); assignAdaptivePhoto('.weibo-blank-photo', ['dancey-dragonfruit-photo','dancey-ghl-repost-photo']); assignBackground('.weibo-roommate-video', ['dancey-roommate-video']); },
    'weibo-discover': () => { assignAvatar('.anonymous-avatar', 'discover-choreographer-avatar'); assignBackground('.weibo-video-placeholder', ['discover-choreographer-video']); },
    'cr-fitness-member': () => { assignAvatar('.cr-member-avatar', 'cr-angelica-avatar'); assignAvatar('.cr-post-avatar.coach', 'cr-zhang-yue-avatar'); assignAvatar('.cr-post:nth-of-type(2) .cr-post-avatar', 'cr-lin-xiaodong-avatar'); assignAvatar('.cr-post-avatar.trainer', 'cr-chen-yi-avatar'); assignBackground('.cr-blank-photo', ['cr-zhang-yue-tea-photo']); }
  };
  if (placeholderPages[pageName]) placeholderPages[pageName]();
  function installWeiboVideo(selector, filename, label) {
    const placeholder = document.querySelector(selector);
    if (!placeholder) return;
    const video = document.createElement('video');
    video.className = 'weibo-native-video';
    video.src = `${placeholderRoot}${filename}`;
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-label', label);
    placeholder.replaceWith(video);
  }
  if (pageName === 'weibo-dandan-dancey') installWeiboVideo('.dancey-roommate-post .weibo-roommate-video', 'Dancey.mp4', '淡淡Dancey发布的视频');
  if (pageName === 'weibo-discover') installWeiboVideo('.weibo-video-placeholder', 'Bao_196.mp4', '不愿透露姓名的编舞师发布的视频');
  const clickableWeiboImages = pageName === 'weibo-tangyixin'
    ? document.querySelectorAll('.weibo-photo-placeholder')
    : pageName === 'weibo-jiyun-ziranma'
      ? document.querySelectorAll('.weibo-post:first-of-type .weibo-blank-photo')
      : [];
  clickableWeiboImages.forEach(element => {
    element.classList.add('weibo-clickable-photo');
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    const openImage = () => {
      const background = getComputedStyle(element).backgroundImage;
      const source = background.match(/url\(["']?(.*?)["']?\)/)?.[1];
      if (!source) return;
      let viewer = document.querySelector('.weibo-photo-viewer');
      if (!viewer) {
        viewer = document.createElement('button');
        viewer.className = 'weibo-photo-viewer';
        viewer.type = 'button';
        viewer.setAttribute('aria-label', '关闭图片预览');
        viewer.innerHTML = '<img alt="微博图片">';
        viewer.addEventListener('click', () => viewer.hidden = true);
        document.body.append(viewer);
      }
      viewer.querySelector('img').src = source;
      viewer.hidden = false;
    };
    element.addEventListener('click', openImage);
    element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openImage(); } });
  });
})();
