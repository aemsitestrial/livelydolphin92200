/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-profile. Base block: tabs.
 * Source: https://wknd-trendsetters.site
 * Generated for xwalk project (field hints included).
 *
 * Library structure: 2 columns, one row per tab.
 *   Cell 1 (title)  - the tab label (field:title).
 *   Cell 2 (content)- tab panel content grouped as content_* fields:
 *       field:content_heading (name/label), field:content_image, field:content_richtext.
 *   content_headingType is collapsed (heading tag), no hint.
 * UE model (tabs-profile-item): title, content_heading, content_headingType,
 *   content_image, content_richtext.
 */
export default function parse(element, { document }) {
  const field = (name, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => { if (n) frag.appendChild(n); });
    return frag;
  };

  // Panels (content) and menu buttons (labels), keyed by tab index.
  const panels = Array.from(element.querySelectorAll('.tabs-content > .tab-pane'));
  const menuLinks = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));

  const cells = [];
  panels.forEach((panel, i) => {
    // Tab label: prefer the matching menu button's name text, else fall back to panel name.
    const menu = menuLinks[i];
    let labelText = '';
    if (menu) {
      const strong = menu.querySelector('strong');
      labelText = (strong ? strong.textContent : menu.textContent).trim();
    }

    const labelP = document.createElement('p');
    labelP.textContent = labelText;

    // Panel image.
    const image = panel.querySelector('img');

    // Panel heading: the person's name (rendered as <strong> in a div). Promote to h3.
    const nameEl = panel.querySelector('.paragraph-xl strong, strong');
    const heading = document.createElement('h3');
    heading.textContent = nameEl ? nameEl.textContent.trim() : '';

    // Richtext content: role/title line and the quote paragraph(s).
    const richNodes = [];
    // The role/subtitle sits in the div following the name wrapper.
    const nameWrapper = nameEl ? nameEl.closest('div') : null;
    const subtitle = nameWrapper ? nameWrapper.nextElementSibling : null;
    if (subtitle && subtitle.textContent.trim()) {
      const subP = document.createElement('p');
      subP.textContent = subtitle.textContent.trim();
      richNodes.push(subP);
    }
    panel.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) richNodes.push(p);
    });

    const contentCell = document.createDocumentFragment();
    if (heading.textContent) contentCell.appendChild(field('content_heading', heading));
    if (image) contentCell.appendChild(field('content_image', image));
    if (richNodes.length) contentCell.appendChild(field('content_richtext', ...richNodes));

    cells.push([
      field('title', labelP),
      contentCell,
    ]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-profile', cells });
  element.replaceWith(block);
}
