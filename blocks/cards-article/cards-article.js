import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    // Split the meta line "Category • Date" into a styled tag + date
    const body = li.querySelector('.cards-article-card-body');
    if (body) {
      const meta = [...body.querySelectorAll('p')].find((p) => p.textContent.includes('•'));
      if (meta) {
        const [category, ...rest] = meta.textContent.split('•');
        const date = rest.join('•').trim();
        meta.textContent = '';
        meta.className = 'cards-article-meta';
        if (category.trim()) {
          const tag = document.createElement('span');
          tag.className = 'cards-article-tag';
          tag.textContent = category.trim();
          meta.append(tag);
        }
        if (date) {
          const dateEl = document.createElement('span');
          dateEl.className = 'cards-article-date';
          dateEl.textContent = date;
          meta.append(dateEl);
        }
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
