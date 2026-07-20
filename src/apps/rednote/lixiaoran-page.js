(function () {
  const modal = document.querySelector('#lixiaoranNoteModal');
  function close() { modal.hidden = true; document.body.classList.remove('rednote-modal-open'); }
  document.querySelector('[data-open-lixiaoran-note]').addEventListener('click', () => { modal.hidden = false; document.body.classList.add('rednote-modal-open'); });
  document.querySelector('.rednote-close').addEventListener('click', close);
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) close(); });
})();
