/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base block: columns.
 * Source: https://wknd-trendsetters.site
 * Generated for xwalk project.
 *
 * Library structure: first row is block name; second row has one cell per column.
 * NOTE: Columns blocks do NOT use field-hint comments (hinting.md Rule 4 exception).
 * Source has 2 top-level columns: an image column and a text column (breadcrumbs,
 * heading, author/meta).
 */
export default function parse(element, { document }) {
  // Top-level columns are the direct child divs of the grid layout (validated in source.html).
  let columns = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: if no direct-child divs found, treat the whole element as a single column.
  if (!columns.length) columns = [element];

  const cells = [];
  // Single content row: each column becomes one cell holding its child nodes.
  const row = columns.map((col) => Array.from(col.childNodes).filter((n) => {
    // Keep element nodes and non-empty text nodes.
    if (n.nodeType === 1) return true;
    return n.nodeType === 3 && n.textContent.trim();
  }));

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
