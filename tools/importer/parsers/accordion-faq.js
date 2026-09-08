/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://wknd-trendsetters.site
 * Generated for xwalk project (field hints included).
 *
 * Library structure: 2 columns, one row per accordion item.
 *   Cell 1 (summary) - clickable title/label.
 *   Cell 2 (text)    - richtext body shown when expanded.
 * UE model (accordion-faq-item): summary (text), text (richtext).
 */
export default function parse(element, { document }) {
  // Helper: wrap content nodes with a UE field-hint comment placed before content.
  const field = (name, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => { if (n) frag.appendChild(n); });
    return frag;
  };

  // Each <details class="faq-item"> is one accordion item (validated against source.html).
  const items = Array.from(element.querySelectorAll('details.faq-item, .faq-item'));

  const cells = [];
  items.forEach((item) => {
    // Title: text inside <summary> (the <span>), excluding the toggle icon.
    const summaryEl = item.querySelector('summary .faq-question span, .faq-question span, summary span, summary');
    const titleText = summaryEl ? summaryEl.textContent.trim() : '';
    const titleP = document.createElement('p');
    titleP.textContent = titleText;

    // Content: the answer body (richtext). Prefer the paragraphs inside .faq-answer.
    const answer = item.querySelector('.faq-answer');
    const contentNodes = [];
    if (answer) {
      const children = Array.from(answer.children).filter((c) => c.textContent.trim() || c.querySelector('img, a'));
      if (children.length) {
        contentNodes.push(...children);
      } else if (answer.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = answer.textContent.trim();
        contentNodes.push(p);
      }
    }

    cells.push([
      field('summary', titleP),
      field('text', ...contentNodes),
    ]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
