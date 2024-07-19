// src/renderer/JSXRenderer.ts
import {createElement} from "react";
import {renderToReadableStream} from "react-dom/server.browser";
import Extractor2 from "./Extractor.js";

class Renderer {
  Component;
  options;
  locale;
  messages;
  extractor;
  constructor(Component, options = {}) {
    this.Component = Component;
    this.options = options;
    this.prepareLocale = this.prepareLocale.bind(this);
    this.render = this.render.bind(this);
    this.extractor = this.options.htmlString ? new Extractor2(this.options.htmlString) : undefined;
  }
  async prepareLocale(header) {
    if (this.options.loadMessages) {
      this.locale = header ? header.slice(0, 2) : this.options.defaultLocale || "en";
    }
  }
  async render(req) {
    await this.prepareLocale(req.headers.get("accept-language") || undefined);
    const jsx = createElement(this.Component, {
      locale: this.locale,
      scriptTags: this.extractor?.getScriptTags(),
      linkTags: this.extractor?.getLinkTags()
    });
    return renderToReadableStream(jsx);
  }
}
export {
  Renderer as default
};
