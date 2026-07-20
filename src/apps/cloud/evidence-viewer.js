(function () {
  const items = {
    xu: { src: './src/assets/evidence/suspect-xu-jieer.webp', alt: '嫌疑人徐洁儿的临时档案照片' },
    zhang: { src: './src/assets/evidence/suspect-zhang-yue.webp', alt: '嫌疑人张月的临时档案照片' },
    huang: { src: './src/assets/evidence/suspect-huang-cancan.webp', alt: '嫌疑人黄灿灿的临时档案照片' }
  };
  const viewer = document.querySelector('#evidenceViewer');
  const image = document.querySelector('#evidenceImage');
  function close() { viewer.hidden = true; image.removeAttribute('src'); }
  document.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => {
    const item = items[button.dataset.evidence];
    image.src = item.src; image.alt = item.alt;
    viewer.hidden = false;
  }));
  viewer.addEventListener('click', close);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !viewer.hidden) close(); });
})();
