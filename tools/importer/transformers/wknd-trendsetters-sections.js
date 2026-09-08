/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + Section Metadata.
 *
 * Section boundaries come from payload.template.sections (DOM-verified during
 * page analysis; selectors used verbatim). The "home" template has 7 sections:
 *   rc1 light-grey, rc2 (none), rc3 light-grey, rc4 (none),
 *   rc5 light-grey, rc6 (none), rc7 dark
 * Expected output: 6 <hr> breaks (one before each non-first section) and
 * 4 Section Metadata blocks (rc1, rc3, rc5, rc7).
 *
 * Both hooks are used on purpose: block parsers run between the hooks and
 * replace section elements, so <hr> breaks are inserted in beforeTransform
 * (while every section element still exists) using a marker attribute, and
 * Section Metadata blocks are anchored to that marker in afterTransform.
 * Sections are iterated in reverse so live-element inserts never disturb
 * not-yet-processed sections.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      // First section gets no leading break; if it also has no style, skip entirely.
      if (i === 0 && !section.style) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived post-parse — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
