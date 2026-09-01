import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildPicture(cell, alt) {
  const existing = cell.querySelector('picture');
  if (existing) return existing;

  const anchor = cell.querySelector('a');
  const src = anchor ? anchor.href : cell.textContent.trim();
  if (!src) return null;

  return createOptimizedPicture(src, alt, true, [{ width: '800' }]);
}

export default function decorate(block) {
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
