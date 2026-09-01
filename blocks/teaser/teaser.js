import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function isAemDeliveryUrl(src) {
  return src.includes('/adobe/assets/') || src.includes('delivery-p');
}

function resolveLayout(block) {
  const rows = [...block.children];
  const supportedLayouts = new Set(['full', '2', '3', 'two', 'three']);

  for (const row of rows.slice(2)) {
    const rawValue = row.textContent.trim().toLowerCase();
    if (!rawValue) continue;

    if (rawValue === 'two') return '2';
    if (rawValue === 'three') return '3';
    if (supportedLayouts.has(rawValue)) return rawValue;
  }

  if (block.classList.contains('teaser-layout-2')) return '2';
  if (block.classList.contains('teaser-layout-3')) return '3';

  return 'full';
}

function buildPicture(cell, alt) {
  const existing = cell.querySelector('picture');
  if (existing) return existing;

  const anchor = cell.querySelector('a');
  const src = anchor ? anchor.href : cell.textContent.trim();
  if (!src) return null;

  if (isAemDeliveryUrl(src)) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    const picture = document.createElement('picture');
    picture.append(img);
    return picture;
  }

  return createOptimizedPicture(src, alt, true, [{ width: '800' }]);
}

export default function decorate(block) {
  const layout = resolveLayout(block);
  block.classList.remove('teaser-layout-full', 'teaser-layout-2', 'teaser-layout-3');
  block.classList.add(`teaser-layout-${layout}`);

  const [imageRow, contentRow] = [...block.children];

  const [imageCell, altCell] = [...(imageRow?.children || [])];
  const alt = altCell?.textContent?.trim() || '';
  const picture = buildPicture(imageCell, alt);

  const imageContainer = document.createElement('div');
  imageContainer.className = 'teaser-image';
  if (picture) {
    moveInstrumentation(imageCell, imageContainer);
    imageContainer.append(picture);
  }

  const contentContainer = document.createElement('div');
  contentContainer.className = 'teaser-content';

  if (contentRow) {
    const [textCell, ctaCell] = [...contentRow.children];

    if (textCell) {
      moveInstrumentation(textCell, contentContainer);
      while (textCell.firstChild) contentContainer.append(textCell.firstChild);
    }

    if (ctaCell) {
      const link = ctaCell.querySelector('a');
      if (link) {
        link.className = 'button';
        const p = document.createElement('p');
        p.className = 'button-container';
        p.append(link);
        contentContainer.append(p);
      }
    }
  }

  block.textContent = '';
  block.append(imageContainer, contentContainer);
}
