(function () {
  const portrait = document.querySelector('.by5-portrait-placeholder');
  if (portrait) {
    portrait.classList.add('by5-portrait-image');
    portrait.innerHTML = '<img src="./src/assets/placeholders/by5-xu-jieer-portrait.webp" alt="徐洁儿照片待替换图片">';
  }
  const name = document.querySelector('.by5-ceo-card h2');
  if (name) {
    name.classList.add('by5-selectable-name');
    name.textContent = '徐洁儿（徐致菁）';
  }
})();
