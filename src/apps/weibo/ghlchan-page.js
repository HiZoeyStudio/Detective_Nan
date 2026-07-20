(function () {
  const button = document.querySelector('#toggleGhlRepost');
  const repost = document.querySelector('#ghlRepost');
  button.addEventListener('click', () => {
    repost.hidden = !repost.hidden;
    button.classList.toggle('active', !repost.hidden);
  });
})();
