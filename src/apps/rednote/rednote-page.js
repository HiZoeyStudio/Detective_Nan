(function () {
  const modal = document.querySelector('#rednoteModal');
  function close() { modal.hidden = true; document.body.classList.remove('rednote-modal-open'); }
  document.querySelector('[data-open-note]').addEventListener('click', () => { modal.hidden = false; document.body.classList.add('rednote-modal-open'); });
  document.querySelector('.rednote-close').addEventListener('click', close);
  const lixiaoran = Array.from(document.querySelectorAll('.rednote-comments b')).find(item => item.textContent.trim() === '李小冉');
  if (lixiaoran) {
    const avatar = lixiaoran.closest('article')?.querySelector('.comment-avatar.li');
    const openProfile = () => { window.location.href = './xiaohongshu-lixiaoran.html'; };
    [lixiaoran, avatar].filter(Boolean).forEach(target => {
      target.classList.add('rednote-user-link'); target.tabIndex = 0; target.setAttribute('role', 'link');
      target.addEventListener('click', openProfile);
      target.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProfile(); } });
    });
  }
  const lixiaozai = Array.from(document.querySelectorAll('.rednote-comments b')).find(item => item.textContent.trim() === '李小再');
  if (lixiaozai) {
    const avatar = lixiaozai.closest('article')?.querySelector('.comment-avatar.li');
    const openProfile = () => { window.location.href = './xiaohongshu-lixiaoran.html'; };
    [lixiaozai, avatar].filter(Boolean).forEach(target => {
      target.classList.add('rednote-user-link'); target.tabIndex = 0; target.setAttribute('role', 'link');
      target.addEventListener('click', openProfile);
      target.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProfile(); } });
    });
  }
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) close(); });
})();
