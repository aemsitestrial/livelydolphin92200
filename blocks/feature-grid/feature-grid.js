/*
 * Feature Grid Block
 *
 * Doc table structure (one row per feature):
 *   | Feature Grid |           |                    |
 *   | icon emoji   | Feature 1 | Short description  |
 *   | icon emoji   | Feature 2 | Short description  |
 *
 * Renders as a responsive CSS grid of feature tiles.
 */
export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'feature-grid-list';

  [...block.children].forEach((row) => {
    const [iconCell, titleCell, descCell] = row.children;

    const tile = document.createElement('li');
    tile.className = 'feature-grid-tile';

    const icon = document.createElement('div');
    icon.className = 'feature-grid-tile-icon';
    icon.textContent = iconCell ? iconCell.textContent.trim() : '';

    const title = document.createElement('h3');
    title.className = 'feature-grid-tile-title';
    title.textContent = titleCell ? titleCell.textContent.trim() : '';

    const desc = document.createElement('p');
    desc.className = 'feature-grid-tile-desc';
    desc.textContent = descCell ? descCell.textContent.trim() : '';

    tile.append(icon, title, desc);
    grid.append(tile);
  });

  block.textContent = '';
  block.append(grid);
}
