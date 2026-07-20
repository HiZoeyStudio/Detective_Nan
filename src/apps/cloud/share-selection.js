(function () {
  const checks = Array.from(document.querySelectorAll('[data-file-check]'));
  const all = document.querySelector('[data-select-all]');
  const label = document.querySelector('.cloud-selection b');
  function update() {
    const count = checks.filter(item => item.classList.contains('checked')).length;
    label.textContent = `已选中${count}个文件`;
    all.classList.toggle('checked', count === checks.length);
    all.textContent = count === checks.length ? '✓' : '';
  }
  checks.forEach(check => check.addEventListener('click', event => {
    event.preventDefault(); event.stopPropagation();
    check.classList.toggle('checked'); check.textContent = check.classList.contains('checked') ? '✓' : '';
    update();
  }));
  all.addEventListener('click', () => {
    const select = !all.classList.contains('checked');
    checks.forEach(check => { check.classList.toggle('checked', select); check.textContent = select ? '✓' : ''; });
    update();
  });
  update();
})();
