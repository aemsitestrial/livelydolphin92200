/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base block: cards.
 * Source: https://wknd-trendsetters.site
 * Generated for xwalk project (field hints included).
 *
 * Library structure: container block, one row per card, 2 cells:
 *   Cell 1 (image) - field:image (imageAlt collapsed into alt attribute).
 *   Cell 2 (text)  - field:text richtext (may be empty, but cell must exist).
 * UE model (card): image (reference), text (richtext).
 * This gallery variant has image-only cards; the text cell is left empty.
 */
export default function parse(element, { document }) {
  const field = (name, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => { if (n) frag.appendChild(n); });
    return frag;
  };

  // Each direct child div wraps one card image (validated: div.utility-aspect-1x1 > img).
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  cardEls.forEach((card) => {
    const image = card.querySelector('img');
    if (!image) return;
    // Image cell gets a field hint; empty text cell stays empty (no hint per Rule 4).
    cells.push([
      field('image', image),
      '',
    ]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
