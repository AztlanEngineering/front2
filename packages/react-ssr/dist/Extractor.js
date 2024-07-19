// src/renderer/Extractor.ts
import {parseDocument} from "htmlparser2";
import React from "react";

class Extractor {
  document;
  constructor(html) {
    this.document = parseDocument(html);
  }
  getElementsByTagName(tagName) {
    const elements = [];
    const stack = [this.document];
    while (stack.length) {
      const node = stack.pop();
      if (!node)
        continue;
      if (node.type === "tag" && node.name === tagName) {
        elements.push(node);
      }
      if (node.type === "script" && tagName === "script") {
        elements.push(node);
      }
      if (node.children) {
        stack.push(...node.children);
      }
    }
    console.log(`Found ${elements.length} <${tagName}> tags`);
    return elements;
  }
  convertToReactElement(element) {
    const props = {};
    for (const [key, value] of Object.entries(element.attribs)) {
      props[key] = value;
    }
    return React.createElement(element.name, props);
  }
  getLinkTags() {
    const linkElements = this.getElementsByTagName("link");
    return linkElements.map(this.convertToReactElement);
  }
  getScriptTags() {
    const scriptElements = this.getElementsByTagName("script");
    return scriptElements.map(this.convertToReactElement);
  }
}
var Extractor_default = Extractor;
export {
  Extractor_default as default
};
