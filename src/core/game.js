const SAVE_KEY = 'detective-nan-save-v1';

const defaultSave = () => ({ readMails: [], acceptedCases: [], solvedCases: [], storyStep: 1 });

window.createGame = function createGame({ root, caseCatalog }) {
  let save = loadSave();
  let currentApp = null;
  let normalBounds = null;
  const windows = root.querySelector('#windowLayer');
  const notifications = root.querySelector('#notifications');

  caseCatalog.filter(item => item.manifest.initiallyAccepted).forEach(item => {
    if (!save.acceptedCases.includes(item.manifest.id)) save.acceptedCases.push(item.manifest.id);
  });
  updateStoryProgress(1, false);
  persist();

  root.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openApp(button.dataset.open));
  });
  root.querySelectorAll('[data-open-edge-page]').forEach(button => button.addEventListener('click', () => window.open('./edge-search.html', '_blank', 'noopener')));
  root.querySelector('#desktopSearchForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const query = root.querySelector('#desktopSearchInput').value;
    const key = query.trim().toLowerCase();
    const hasMatch = (window.nanSearchIndex || []).some(item => item.keywords.some(word => word.toLowerCase() === key));
    if (!hasMatch) {
      showTaskbarNoMatch(event.currentTarget);
      return;
    }
    window.open(`./edge-search.html?q=${encodeURIComponent(query)}`, '_blank', 'noopener');
  });
  root.querySelector('#desktopSearchInput')?.addEventListener('input', event => {
    const form = event.currentTarget.closest('form');
    const key = event.currentTarget.value.trim().toLowerCase();
    const hasMatch = !!key && (window.nanSearchIndex || []).some(item => item.keywords.some(word => word.toLowerCase() === key));
    form.querySelector('.taskbar-search-popup')?.remove();
    if (key && !hasMatch) showTaskbarNoMatch(form);
  });

  updateClock();
  if (new URLSearchParams(location.search).get('app') === 'mail') openApp('mail');

  function openApp(appId) {
    if (currentApp === appId && windows.innerHTML) {
      windows.classList.add('visible');
      windows.classList.remove('minimized');
      updateDesktopTaskbarState(appId);
      return;
    }
    currentApp = appId;
    windows.classList.remove('maximized', 'minimized', 'locked-fullscreen', 'resizable-window');
    windows.removeAttribute('style');
    windows.innerHTML = appId === 'mail' ? renderMail() : appId === 'browser' ? renderBrowser() : renderTerminal();
    configureWindowMode(appId);
    windows.classList.add('visible');
    windows.classList.remove('minimized');
    updateDesktopTaskbarState(appId);
    bindWindow(appId);
  }

  function showTaskbarNoMatch(form) {
    form.querySelector('.taskbar-search-popup')?.remove();
    const popup = document.createElement('div');
    popup.className = 'taskbar-search-popup';
    popup.textContent = '未找到匹配结果';
    form.append(popup);
  }

  function bindWindow(appId) {
    bindWindowChrome();
    windows.querySelectorAll('[data-mail]').forEach(item => {
      item.addEventListener('click', () => openMail(item.dataset.mail));
    });
    windows.querySelectorAll('[data-case]').forEach(item => {
      item.addEventListener('click', () => openCase(item.dataset.case));
    });
    bindInboxFolder();
    windows.querySelectorAll('[data-browser-favorite]').forEach(item => {
      item.addEventListener('click', () => showBrowserPage(item.dataset.browserFavorite));
    });
    const browserForm = windows.querySelector('#browserSearchForm');
    if (browserForm) browserForm.addEventListener('submit', event => {
      event.preventDefault();
      searchBrowser(windows.querySelector('#browserSearchInput').value);
    });
    if (appId === 'mail') windows.querySelector('[data-inbox]')?.focus();
  }

  function bindWindowChrome() {
    windows.querySelector('[data-close]').addEventListener('click', closeWindow);
    windows.querySelector('[data-minimize]').addEventListener('click', minimizeWindow);
    windows.querySelector('[data-maximize]').addEventListener('click', toggleMaximize);
    const titlebar = windows.querySelector('.window-title');
    titlebar.addEventListener('dblclick', event => {
      if (!event.target.closest('button')) toggleMaximize();
    });
    titlebar.addEventListener('pointerdown', beginWindowDrag);
  }

  function closeWindow() {
    windows.classList.remove('visible');
    windows.classList.remove('maximized', 'minimized');
    windows.innerHTML = '';
    windows.removeAttribute('style');
    currentApp = null;
    normalBounds = null;
    updateDesktopTaskbarState(null);
  }

  function minimizeWindow() {
    if (windows.classList.contains('locked-fullscreen')) return;
    windows.classList.add('minimized');
    if (currentApp === 'mail') updateDesktopTaskbarState(null);
  }

  function toggleMaximize() {
    if (windows.classList.contains('locked-fullscreen')) return;
    if (windows.classList.contains('maximized')) {
      windows.classList.remove('maximized');
      if (normalBounds) applyBounds(normalBounds);
      windows.querySelector('[data-maximize]').textContent = '□';
      windows.querySelector('[data-maximize]').title = '最大化';
      return;
    }
    const rect = windows.getBoundingClientRect();
    normalBounds = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    windows.removeAttribute('style');
    windows.classList.add('maximized');
    windows.querySelector('[data-maximize]').textContent = '❐';
    windows.querySelector('[data-maximize]').title = '还原';
  }

  function beginWindowDrag(event) {
    if (event.button !== 0 || event.target.closest('button') || windows.classList.contains('maximized') || windows.classList.contains('locked-fullscreen')) return;
    event.preventDefault();
    const rect = windows.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    const move = moveEvent => {
      const maxLeft = Math.max(0, window.innerWidth - width);
      const maxTop = Math.max(0, window.innerHeight - 40 - height);
      applyBounds({
        left: Math.min(maxLeft, Math.max(0, moveEvent.clientX - offsetX)),
        top: Math.min(maxTop, Math.max(0, moveEvent.clientY - offsetY)),
        width,
        height
      });
    };
    const end = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
  }

  function applyBounds(bounds) {
    Object.assign(windows.style, {
      left: `${bounds.left}px`, top: `${bounds.top}px`,
      width: `${bounds.width}px`, height: `${bounds.height}px`,
      right: 'auto', bottom: 'auto'
    });
  }

  function configureWindowMode(appId) {
    if (appId === 'terminal') {
      windows.classList.add('locked-fullscreen', 'maximized');
      normalBounds = null;
      return;
    }
    windows.classList.add('resizable-window');
    const widthRatio = appId === 'mail' ? .64 : .9;
    const minimumWidth = appId === 'mail' ? 760 : 760;
    const width = Math.min(window.innerWidth - 40, Math.max(minimumWidth, window.innerWidth * widthRatio));
    const normalHeight = Math.min((window.innerHeight - 40) * .88, Math.max(520, window.innerHeight - 90));
    const height = appId === 'mail' ? normalHeight * .9 : normalHeight;
    applyBounds({ left: Math.max(10, (window.innerWidth - width) / 2), top: Math.max(10, (window.innerHeight - 40 - height) / 2), width, height });
  }

  function renderShell(title, appClass, content) {
    const titleContent = appClass === 'mail-app'
      ? `<span class="window-app-brand"><img src="./src/assets/outlook.svg" alt="">Omail</span>`
      : `<span>${title}</span>`;
    return `<article class="app-window ${appClass}">
      <header class="window-title">${titleContent}<div class="window-controls"><button data-minimize title="最小化" aria-label="最小化">—</button><button data-maximize title="最大化" aria-label="最大化">□</button><button data-close title="关闭" aria-label="关闭">×</button></div></header>
      ${content}
    </article>`;
  }

  function renderBrowser() {
    return renderShell('Macrosoft Edge', 'browser-app edge-browser', `<div class="edge-tabs"><div class="edge-tab"><img src="./src/assets/microsoft-edge.svg" alt=""><span>新建标签页</span><button>×</button></div><button>＋</button><span></span><button>⌄</button></div><div class="browser-toolbar"><button>←</button><button>→</button><button>↻</button><div class="browser-address"><span>⌕</span><span>搜索或输入 Web 地址</span></div><button>☆</button><button>◉</button><button>⋯</button></div><main class="browser-page"><div class="browser-home"><div class="browser-logo"><img src="./src/assets/microsoft-edge.svg" alt=""><b>Coogle</b></div><form id="browserSearchForm" class="browser-search"><span>⌕</span><input id="browserSearchInput" autocomplete="off" placeholder="输入关键词"><button>搜索</button></form></div></main>`);
  }

  function searchBrowser(query) {
    const keyword = query.trim().toLowerCase();
    const results = (window.nanSearchIndex || []).filter(entry => entry.keywords.some(item => item.toLowerCase() === keyword));
    const page = windows.querySelector('.browser-page');
    page.innerHTML = `<div class="browser-results"><header><b>寻迹</b><form id="browserSearchForm" class="browser-search"><span>⌕</span><input id="browserSearchInput" value="${escapeHtml(query)}" autocomplete="off"><button>搜索</button></form></header><p>搜索结果</p>${results.length ? results.map(entry => `<button class="browser-result" data-browser-favorite="${entry.id}"><small>${entry.url}</small><h2>${entry.title}</h2><span>${entry.summary}</span></button>`).join('') : `<div class="no-results"><b>没有找到相关内容</b><span>请检查关键词是否准确。宽泛或错误的词语不会显示资料。</span></div>`}</div>`;
    bindBrowserPage();
  }

  function showBrowserPage(id) {
    const entry = (window.nanSearchIndex || []).find(item => item.id === id);
    if (!entry) return;
    windows.querySelector('.browser-address span:last-child').textContent = entry.url;
    windows.querySelector('.browser-page').innerHTML = `<article class="simulated-site"><small>${entry.url}</small><h1>${entry.title}</h1><p>${entry.page}</p><button id="browserHomeButton">返回主页</button></article>`;
    windows.querySelector('#browserHomeButton').addEventListener('click', () => openAppFresh('browser'));
  }

  function updateStoryProgress(step, shouldPersist = true) {
    save.storyStep = step;
    const progress = root.querySelector('#storyProgress');
    progress.querySelector('span').textContent = String(step).padStart(2, '0');
    progress.setAttribute('aria-label', `故事进度 ${step} / 17`);
    if (shouldPersist) persist();
  }

  function bindBrowserPage() {
    const form = windows.querySelector('#browserSearchForm');
    form?.addEventListener('submit', event => { event.preventDefault(); searchBrowser(windows.querySelector('#browserSearchInput').value); });
    windows.querySelectorAll('[data-browser-favorite]').forEach(item => item.addEventListener('click', () => showBrowserPage(item.dataset.browserFavorite)));
  }

  function openAppFresh(appId) {
    currentApp = null;
    openApp(appId);
  }

  function renderMail() {
    const mails = caseCatalog.flatMap(item => item.mails.map(mail => ({ ...mail, caseId: item.manifest.id })));
    const firstMail = mails[0];
    if (firstMail && !save.readMails.includes(firstMail.id)) {
      save.readMails.push(firstMail.id);
      persist();
    }
    return renderShell('Omail', 'mail-app', `
      ${renderOutlookApps()}
      <section class="outlook-list"><div class="mail-list">${renderMailRows(mails, firstMail?.id)}</div>
      </section>
      <section class="outlook-preview reading-active">${firstMail ? `<article class="outlook-message"><h1>${firstMail.subject}</h1><div class="outlook-sender">${renderSenderAvatar(firstMail, 0)}<div><b>${firstMail.from.split(' <')[0]}</b><small>${escapeHtml(firstMail.from.match(/<(.+)>/)?.[1] || '')}</small><span>${firstMail.direction === 'sent' ? '收件人：陈凯琳' : '收件人：我'}</span></div><time>${firstMail.receivedAt}</time></div><div class="mail-body">${formatMailBody(firstMail.body)}</div></article>` : ''}</section>`);
  }

  function openMail(mailId) {
    const record = caseCatalog.flatMap(item => item.mails.map(mail => ({ mail, item }))).find(row => row.mail.id === mailId);
    if (!record) return;
    if (!save.readMails.includes(mailId)) save.readMails.push(mailId);
    persist();
    const accepted = save.acceptedCases.includes(record.item.manifest.id);
    const mails = caseCatalog.flatMap(item => item.mails.map(mail => ({ ...mail, caseId: item.manifest.id })));
    windows.innerHTML = renderShell('Omail', 'mail-app', `
      ${renderOutlookApps()}
      <section class="outlook-list compact-list"><div class="mail-list">${renderMailRows(mails, mailId)}</div></section>
      <section class="outlook-preview reading-active"><article class="outlook-message"><h1>${record.mail.subject}</h1><div class="outlook-sender">${renderSenderAvatar(record.mail, mails.findIndex(mail => mail.id === mailId))}<div><b>${record.mail.from.split(' <')[0]}</b><small>${escapeHtml(record.mail.from.match(/<(.+)>/)?.[1] || '')}</small><span>${record.mail.direction === 'sent' ? '收件人：陈凯琳' : '收件人：我'}</span></div><time>${record.mail.receivedAt}</time></div><div class="mail-body">${formatMailBody(record.mail.body)}</div></article>
      </section>`);
    bindWindowChrome();
    bindInboxFolder();
    windows.querySelectorAll('[data-mail]').forEach(item => item.addEventListener('click', () => openMail(item.dataset.mail)));
    const openClient = () => {
      currentApp = null;
      openApp('terminal');
      openCase(record.item.manifest.id);
    };
    windows.querySelectorAll('[data-open-client-link]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openClient(); }));
  }

  function acceptCase(caseData) {
    if (!save.acceptedCases.includes(caseData.manifest.id)) save.acceptedCases.push(caseData.manifest.id);
    persist();
    showNotification('事务所终端', `新案件「${caseData.manifest.title}」已添加至案件列表`);
    openMail(caseData.manifest.entryMailId);
  }

  function renderMailRows(mails, selectedId = '') {
    return mails.map(mail => {
      const isPseudoLink = mail.id.startsWith('mail-placeholder-');
      return `<button ${isPseudoLink ? 'aria-disabled="true"' : `data-mail="${mail.id}"`} class="mail-row ${isPseudoLink ? 'mail-pseudo-link' : ''} ${save.readMails.includes(mail.id) ? 'read' : ''} ${mail.id === selectedId ? 'selected' : ''}"><span class="outlook-row-body"><b>${mail.direction === 'sent' ? '我 → 陈凯琳' : mail.from.split(' <')[0]}</b><strong>${mail.subject}</strong><i>${mail.preview}</i></span><time>${mail.receivedAt}</time><span class="row-pin">${mail.direction === 'sent' ? '已发送' : '☆'}</span></button>`;
    }).join('');
  }

  function updateDesktopTaskbarState(appId) {
    root.querySelectorAll('.taskbar-apps button').forEach(button => button.classList.remove('taskbar-active'));
    if (appId === 'mail') root.querySelector('.taskbar-apps [data-open="mail"]')?.classList.add('taskbar-active');
  }

  function bindInboxFolder() {
    const inbox = windows.querySelector('[data-mail-folder="inbox"]');
    if (!inbox) return;
    inbox.addEventListener('click', event => {
      event.preventDefault();
      inbox.classList.add('active');
    });
  }

  function renderSenderAvatar(mail, index) {
    const senderName = mail.direction === 'sent' ? '谢楠' : mail.from.split(' <')[0];
    const colorIndex = Math.max(0, index) % 5;
    return `<span class="sender-avatar sender-avatar-${colorIndex}">${escapeHtml(senderName.slice(0, 1))}</span>`;
  }

  function renderTerminal() {
    const accepted = caseCatalog.filter(item => save.acceptedCases.includes(item.manifest.id));
    return renderShell('有楠必解 · 事务所终端', 'terminal-app', `
      <nav class="terminal-nav"><div class="terminal-logo">NAN<br><small>DATABASE</small></div><button class="active">案件列表</button><button>员工档案</button><button>系统日志</button></nav>
      <section class="terminal-main"><header><span>INTERNAL DATABASE / CASES</span><i>● ONLINE</i></header><h1>案件列表</h1>
        ${accepted.length ? `<div class="case-grid">${accepted.map(item => `<button class="case-card" data-case="${item.manifest.id}"><span>${item.manifest.number}</span><b>${item.manifest.title}</b><em>调查中</em></button>`).join('')}</div>` : '<div class="empty-state">NO ACTIVE CASES<br><small>暂无案件。请先在邮件中接受委托。</small></div>'}
      </section>`);
  }

  function openCase(caseId) {
    const item = caseCatalog.find(entry => entry.manifest.id === caseId);
    if (!item) return;
    windows.innerHTML = renderShell('有楠必解 · 事务所终端', 'terminal-app', `
      <nav class="terminal-nav"><div class="terminal-logo">NAN<br><small>DATABASE</small></div><button id="backToCases">← 案件列表</button></nav>
      <section class="terminal-main case-detail"><header><span>${item.manifest.number}</span><i>● ACTIVE</i></header><h1>${item.manifest.title}</h1><p>${item.database.summary}</p>
        <h2>相关人员</h2>${item.database.people.map(person => `<article><b>${person.name}</b><span>${person.role}</span><p>${person.detail}</p></article>`).join('')}
        <h2>已知时间线</h2>${item.database.timeline.map(row => `<div class="timeline"><time>${row.time}</time><span>${row.detail}</span></div>`).join('')}
      </section>`);
    bindWindowChrome();
    windows.querySelector('#backToCases').addEventListener('click', () => openApp('terminal'));
  }

  function showNotification(title, message) {
    const toast = document.createElement('button');
    toast.className = 'notification';
    toast.innerHTML = `<b>${title}</b><span>${message}</span>`;
    toast.addEventListener('click', () => { toast.remove(); openApp('terminal'); });
    notifications.append(toast);
    setTimeout(() => toast.remove(), 6000);
  }

  function renderOutlookHeader() {
    return `<nav class="outlook-ribbon"><button>☰</button><button>文件</button><button class="active">开始</button><button>视图</button><button>帮助</button></nav><div class="outlook-actions"><button class="new-mail">▣ 新建邮件 <span>⌄</span></button><button disabled>⌫</button><button>▱</button><button>♧</button><button>⌁</button><button>↶</button><button>↷</button><button class="quick">ϟ 快速步骤⌄</button><button>✉ 全部标为已读</button><button>▦</button><button>⋯</button><span></span><button class="copilot">◆</button></div>`;
  }

  function renderOutlookApps() {
    return `<aside class="outlook-apps outlook-simple-folders"><button class="active" data-mail-folder="inbox"><b>收件箱</b><em>[5]</em></button><button type="button"><b>草稿</b><em>[1]</em></button><button type="button"><b>已发送邮件</b><em>[2]</em></button><button type="button"><b>垃圾邮件</b><em>[99+]</em></button></aside>`;
  }

  function folderIcon(type) {
    const paths = {
      inbox: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 13h5l2 3h4l2-3h5"/>',
      draft: '<path d="M4 20l4-1 12-12a2.5 2.5 0 0 0-4-4L4 15z"/><path d="M14 5l5 5M3 7h8"/>',
      sent: '<path d="M3 3l19 9-19 9 4-9z"/><path d="M7 12h11"/>',
      junk: '<path d="M4 8h10l3 3h4v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7l2 4"/><circle cx="17" cy="17" r="5"/><path d="M13.5 20.5l7-7"/>'
    };
    return `<svg class="folder-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[type]}</svg>`;
  }

  function renderOutlookSidebar(unreadCount) {
    return `<aside class="mail-sidebar outlook-folders"><button class="compose"><span>＋</span> 新建邮件 <i>⌄</i></button><nav><button><span>☆</span>收藏夹</button><button class="active"><span>▰</span>收件箱<b>${unreadCount}</b></button><button><span>▤</span>草稿</button><button><span>➤</span>已发送邮件</button><button><span>⌫</span>已删除邮件</button><button><span>⌄</span>更多</button></nav><h3>文件夹 <button>＋</button></h3></aside>`;
  }

  function persist() { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
  function loadSave() {
    try { return { ...defaultSave(), ...JSON.parse(localStorage.getItem(SAVE_KEY)) }; }
    catch { return defaultSave(); }
  }
  function updateClock() {
    root.querySelector('#clock').textContent = '17:45\n2026/06/27';
  }
};

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function formatMailBody(value) {
  return escapeHtml(value)
    .replaceAll('https://cloud.omail.com/share/grace91-case001', '<a href="./cloud-grace91.html" target="_blank" rel="noopener" data-open-cloud-link>https://cloud.omail.com/share/grace91-case001</a>')
    .replaceAll('nan://case-upload/case-001', '<a href="#" data-open-client-link>nan://case-upload/case-001</a>')
    .replaceAll('\n', '<br>');
}
