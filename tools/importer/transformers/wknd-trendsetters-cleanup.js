/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Non-authorable chrome present in captured DOM:
 *  - a.skip-link           -> "Skip to main content" accessibility link (before <main>)
 *  - div.navbar            -> global top navigation / mega menu (before <main>)
 *  - footer.footer         -> global site footer (after </main>)
 *  - div.breadcrumbs       -> breadcrumb trail inside the Featured article section
 *                             (#main-content > section.section:nth-of-type(1) ... > div.breadcrumbs)
 *
 * NOTE: bare <header> is intentionally NOT removed — on this site the hero
 * section (template section rc1) is authorable content at
 * "#main-content > header.section.secondary-section".
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Global chrome that is not authorable page content.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Breadcrumb trail inside the article section is navigational chrome, not authorable.
    WebImporter.DOMUtils.remove(element, [
      'div.breadcrumbs',
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
