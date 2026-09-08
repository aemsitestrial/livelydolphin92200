/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards.
 * Source: https://wknd-trendsetters.site
 * Generated for xwalk project (field hints included).
 *
 * Library structure: container block, one row per card, 2 cells:
 *   Cell 1 (image) - field:image (imageAlt collapsed into alt attribute).
 *   Cell 2 (text)  - field:text richtext: meta tag/date, heading, and the card link (CTA).
 * UE model (card): image (reference), text (richtext).
 */
export default function parse(element, { document }) {
  const field = (name, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => { if (n) frag.appendChild(n); });
    return frag;
  };

  // Each card is an <a class="article-card"> (validated against source.html).
  const cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cardEls.forEach((card) => {
    const href = card.getAttribute('href');
    const image = card.querySelector('.article-card-image img, img');

    // Text content: meta line (tag + date), heading, and a CTA link back to the article.
    const textNodes = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) {
      const metaP = document.createElement('p');
      const parts = Array.from(meta.querySelectorAll('span')).map((s) => s.textContent.trim()).filter(Boolean);
      metaP.textContent = parts.join(' • ');
      if (metaP.textContent) textNodes.push(metaP);
    }
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) {
      // Rebuild as a heading, linking the title to the article (single text instance,
      // avoids duplicating the title as a separate CTA).
      const level = /^h[1-6]$/i.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h3';
      const h = document.createElement(level);
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = heading.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = heading.textContent.trim();
      }
      textNodes.push(h);
    }

    cells.push([
      field('image', image || undefined),
      field('text', ...textNodes),
    ]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
