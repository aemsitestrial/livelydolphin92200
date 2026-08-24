export default function decorate(block) {
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cell = row.firstElementChild;
    if (cell) {
      const p = document.createElement('p');
      p.className = 'test-text';
      p.textContent = cell.textContent.trim();
      row.replaceWith(p);
    }
  });
}
