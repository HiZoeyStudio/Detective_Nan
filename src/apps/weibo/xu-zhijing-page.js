(function () {
  const button = document.querySelector('#toggleXuComments');
  const comments = document.querySelector('#xuComments');
  button.addEventListener('click', () => {
    comments.hidden = !comments.hidden;
    button.classList.toggle('active', !comments.hidden);
  });
})();
