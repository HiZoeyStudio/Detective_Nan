(function () {
  const copy = document.querySelector('.news-article-copy');
  if (!copy) return;

  const communityHeading = Array.from(copy.querySelectorAll('h2')).find(item => item.textContent.trim() === '社区里的日常');
  const firstParagraph = communityHeading?.nextElementSibling;
  const secondParagraph = firstParagraph?.nextElementSibling;
  if (firstParagraph?.tagName === 'P' && secondParagraph?.tagName === 'P') {
    const figure = document.createElement('figure');
    figure.className = 'local-news-inline-photo';
    figure.innerHTML = '<img src="./src/assets/placeholders/news-zhangyue-community-run.jpg" alt="下班后在社区跑步的张月"><figcaption>下班后在社区跑步的张月</figcaption>';
    secondParagraph.insertAdjacentElement('beforebegin', figure);
  }

  const article = document.querySelector('.local-news-page>article');
  const footer = article?.querySelector(':scope>footer');
  if (footer) {
    const more = document.createElement('button');
    more.className = 'local-news-more-link';
    more.type = 'button';
    more.setAttribute('aria-disabled', 'true');
    more.textContent = '查看更多';
    footer.insertAdjacentElement('beforebegin', more);
  }
})();
