/*
 * Promo Banner Block
 *
 * Doc table structure (1 row, 3 columns):
 *   | Promo Banner |           |             |
 *   | icon emoji   | headline  | CTA link    |
 *
 * Renders as a full-width coloured strip with icon, text, and a button.
 */
export default function decorate(block) {
  const [row] = block.children;
  const [iconCell, headlineCell, ctaCell] = row.children;

  // Build inner layout
  const wrapper = document.createElement('div');
  wrapper.className = 'promo-banner-inner';

  const icon = document.createElement('span');
  icon.className = 'promo-banner-icon';
  icon.textContent = iconCell.textContent.trim();

  const headline = document.createElement('p');
  headline.className = 'promo-banner-headline';
  headline.textContent = headlineCell.textContent.trim();

  const cta = ctaCell.querySelector('a');
  if (cta) cta.className = 'button promo-banner-cta';

  wrapper.append(icon, headline);
  if (cta) wrapper.append(cta);

  block.textContent = '';
  block.append(wrapper);
}
