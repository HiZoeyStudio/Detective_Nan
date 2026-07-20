(function () {
  const rows = document.querySelectorAll('.pos-order-table button.pos-table-row');
  rows.forEach(row => row.addEventListener('click', () => {
    rows.forEach(item => item.classList.remove('selected'));
    row.classList.add('selected');
  }));
})();
