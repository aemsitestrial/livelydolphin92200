/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document: document2 }) {
    const field = (name, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const image = element.querySelector("img.cover-image, img");
    const heading = element.querySelector('h1, h2, .h1-heading, .h2-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    cells.push([field("image", image || void 0)]);
    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (subheading && subheading !== heading) textNodes.push(subheading);
    ctaLinks.forEach((a) => textNodes.push(a));
    cells.push([field("text", ...textNodes)]);
    if (!heading && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    let columns = Array.from(element.querySelectorAll(":scope > div"));
    if (!columns.length) columns = [element];
    const cells = [];
    const row = columns.map((col) => Array.from(col.childNodes).filter((n) => {
      if (n.nodeType === 1) return true;
      return n.nodeType === 3 && n.textContent.trim();
    }));
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const field = (name, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const cardEls = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    cardEls.forEach((card) => {
      const image = card.querySelector("img");
      if (!image) return;
      cells.push([
        field("image", image),
        ""
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-profile.js
  function parse4(element, { document: document2 }) {
    const field = (name, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const panels = Array.from(element.querySelectorAll(".tabs-content > .tab-pane"));
    const menuLinks = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button"));
    const cells = [];
    panels.forEach((panel, i) => {
      const menu = menuLinks[i];
      let labelText = "";
      if (menu) {
        const strong = menu.querySelector("strong");
        labelText = (strong ? strong.textContent : menu.textContent).trim();
      }
      const labelP = document2.createElement("p");
      labelP.textContent = labelText;
      const image = panel.querySelector("img");
      const nameEl = panel.querySelector(".paragraph-xl strong, strong");
      const heading = document2.createElement("h3");
      heading.textContent = nameEl ? nameEl.textContent.trim() : "";
      const richNodes = [];
      const nameWrapper = nameEl ? nameEl.closest("div") : null;
      const subtitle = nameWrapper ? nameWrapper.nextElementSibling : null;
      if (subtitle && subtitle.textContent.trim()) {
        const subP = document2.createElement("p");
        subP.textContent = subtitle.textContent.trim();
        richNodes.push(subP);
      }
      panel.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim()) richNodes.push(p);
      });
      const contentCell = document2.createDocumentFragment();
      if (heading.textContent) contentCell.appendChild(field("content_heading", heading));
      if (image) contentCell.appendChild(field("content_image", image));
      if (richNodes.length) contentCell.appendChild(field("content_richtext", ...richNodes));
      cells.push([
        field("title", labelP),
        contentCell
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-profile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const field = (name, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    const cells = [];
    cardEls.forEach((card) => {
      const href = card.getAttribute("href");
      const image = card.querySelector(".article-card-image img, img");
      const textNodes = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) {
        const metaP = document2.createElement("p");
        const parts = Array.from(meta.querySelectorAll("span")).map((s) => s.textContent.trim()).filter(Boolean);
        metaP.textContent = parts.join(" \u2022 ");
        if (metaP.textContent) textNodes.push(metaP);
      }
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) {
        const level = /^h[1-6]$/i.test(heading.tagName) ? heading.tagName.toLowerCase() : "h3";
        const h = document2.createElement(level);
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = heading.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = heading.textContent.trim();
        }
        textNodes.push(h);
      }
      cells.push([
        field("image", image || void 0),
        field("text", ...textNodes)
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const field = (name, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const items = Array.from(element.querySelectorAll("details.faq-item, .faq-item"));
    const cells = [];
    items.forEach((item) => {
      const summaryEl = item.querySelector("summary .faq-question span, .faq-question span, summary span, summary");
      const titleText = summaryEl ? summaryEl.textContent.trim() : "";
      const titleP = document2.createElement("p");
      titleP.textContent = titleText;
      const answer = item.querySelector(".faq-answer");
      const contentNodes = [];
      if (answer) {
        const children = Array.from(answer.children).filter((c) => c.textContent.trim() || c.querySelector("img, a"));
        if (children.length) {
          contentNodes.push(...children);
        } else if (answer.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = answer.textContent.trim();
          contentNodes.push(p);
        }
      }
      cells.push([
        field("summary", titleP),
        field("text", ...contentNodes)
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const field = (name, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const image = element.querySelector("img.cover-image, img");
    const heading = element.querySelector('h1, h2, .h1-heading, .h2-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, .card-body p, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    cells.push([field("image", image || void 0)]);
    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (subheading && subheading !== heading) textNodes.push(subheading);
    ctaLinks.forEach((a) => textNodes.push(a));
    cells.push([field("text", ...textNodes)]);
    if (!heading && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.breadcrumbs",
        "noscript",
        "link",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Home / landing page: hero, featured article, image gallery, testimonial tabs, latest article cards, FAQ accordion, and a full-bleed CTA banner.",
    urls: [
      "https://wknd-trendsetters.site"
    ],
    blocks: [
      {
        name: "hero-split",
        instances: [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout"
        ]
      },
      {
        name: "columns-article",
        instances: [
          "#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"
        ]
      },
      {
        name: "tabs-profile",
        instances: [
          "#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout"
        ]
      },
      {
        name: "hero-banner",
        instances: [
          "#main-content > section.section.inverse-section > div.container > div.grid-layout.desktop-1-column"
        ]
      }
    ],
    sections: [
      { id: "rc1", name: "Hero", selector: "#main-content > header.section.secondary-section", style: "light-grey", blocks: ["hero-split"], defaultContent: [] },
      { id: "rc2", name: "Featured article", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-article"], defaultContent: [] },
      { id: "rc3", name: "Image gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "light-grey", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"] },
      { id: "rc4", name: "Testimonial tabs", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-profile"], defaultContent: [] },
      { id: "rc5", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "light-grey", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"] },
      { id: "rc6", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc7", name: "CTA banner", selector: "#main-content > section.section.inverse-section", style: "dark", blocks: ["hero-banner"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-split": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-profile": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
