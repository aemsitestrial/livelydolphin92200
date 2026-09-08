/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base block: hero.
 * Source: https://wknd-trendsetters.site
 * Generated for xwalk project (field hints included).
 *
 * Library structure: 1 column, 3 rows (name row, image row, text row).
 *   Row 2 (image): background/hero image (field:image).
 *   Row 3 (text):  heading + subheading + CTAs as richtext (field:text).
 * UE model (hero-split): image (reference), imageAlt (collapsed), text (richtext).
 */
export default function parse(element, { document }) {
  const field = (name, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => { if (n) frag.appendChild(n); });
    return frag;
  };

  // Image: first image in the block (validated: img.cover-image in the media column).
  const image = element.querySelector('img.cover-image, img');

  // Text content: heading, subheading, CTA buttons.
  const heading = element.querySelector('h1, h2, .h1-heading, .h2-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 2: image cell (field:image). imageAlt is collapsed into the img's alt attribute.
  cells.push([field('image', image || undefined)]);

  // Row 3: text cell (field:text) holding heading, subheading, and CTAs.
  const textNodes = [];
  if (heading) textNodes.push(heading);
  if (subheading && subheading !== heading) textNodes.push(subheading);
  ctaLinks.forEach((a) => textNodes.push(a));
  cells.push([field('text', ...textNodes)]);

  if (!heading && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
