import React, { useState, createElement } from 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { renderToReadableStream } from 'react-dom/server.browser';
import { parseDocument } from 'htmlparser2';

const reactLogo = "/assets/react-CHdo91hT.svg";

const viteLogo = "/vite.svg";

function App({ lang = 'en', scriptTags, linkTags }) {
    return /*#__PURE__*/ jsxs("html", {
        lang: lang,
        children: [
            /*#__PURE__*/ jsxs("head", {
                children: [
                    /*#__PURE__*/ jsx("meta", {
                        charSet: "UTF-8"
                    }),
                    /*#__PURE__*/ jsx("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0"
                    }),
                    /*#__PURE__*/ jsx("title", {
                        children: "React Server Components"
                    }),
                    scriptTags,
                    linkTags
                ]
            }),
            /*#__PURE__*/ jsx("body", {
                children: /*#__PURE__*/ jsx("div", {
                    id: "root",
                    children: /*#__PURE__*/ jsx(InnerApp, {})
                })
            })
        ]
    });
}
const InnerApp = ()=>{
    const [count, setCount] = useState(0);
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsxs("div", {
                children: [
                    /*#__PURE__*/ jsx("a", {
                        href: "https://vitejs.dev",
                        target: "_blank",
                        children: /*#__PURE__*/ jsx("img", {
                            src: viteLogo,
                            className: "logo",
                            alt: "Vite logo"
                        })
                    }),
                    /*#__PURE__*/ jsx("a", {
                        href: "https://react.dev",
                        target: "_blank",
                        children: /*#__PURE__*/ jsx("img", {
                            src: reactLogo,
                            className: "logo react",
                            alt: "React logo"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsx("h1", {
                children: "Vite + React"
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ jsxs("button", {
                        onClick: ()=>setCount((count)=>count + 1),
                        children: [
                            "count is ",
                            count
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "grid container",
                        children: [
                            /*#__PURE__*/ jsx("div", {
                                className: "span-7",
                                children: "7"
                            }),
                            /*#__PURE__*/ jsx("div", {
                                className: "span-1",
                                children: "1"
                            }),
                            /*#__PURE__*/ jsx("div", {
                                className: "span-1",
                                children: "4"
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx("p", {
                        children: "This page is us988889"
                    }),
                    /*#__PURE__*/ jsxs("p", {
                        children: [
                            "Edit ",
                            /*#__PURE__*/ jsx("code", {
                                children: "src/App.jsx"
                            }),
                            " and save to test HMR2 Change here 14        "
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx("p", {
                className: "read-the-docs",
                children: "Click on the Vite and React logos to learn more"
            })
        ]
    });
};

const htmlString = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React</title>\n    <script type=\"module\" crossorigin src=\"/main.js\"></script>\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/main-BHJYjto3.css\">\n  </head>\n  <body>\n    <div id=\"root\"><!--app-html--></div>\n  </body>\n</html>\n";

// src/renderer/Extractor.ts
class Extractor {
    document;
    constructor(html){
        this.document = parseDocument(html);
    }
    getElementsByTagName(tagName) {
        const elements = [];
        const stack = [
            this.document
        ];
        while(stack.length){
            const node = stack.pop();
            if (!node) continue;
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
        for (const [key, value] of Object.entries(element.attribs)){
            props[key] = value;
        }
        return /*#__PURE__*/ React.createElement(element.name, props);
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

// src/renderer/JSXRenderer.ts
let Renderer$1 = class Renderer {
    Component;
    options;
    locale;
    messages;
    extractor;
    constructor(Component, options = {}){
        this.Component = Component;
        this.options = options;
        this.prepareLocale = this.prepareLocale.bind(this);
        this.render = this.render.bind(this);
        this.extractor = this.options.htmlString ? new Extractor_default(this.options.htmlString) : undefined;
    }
    async prepareLocale(header) {
        if (this.options.loadMessages) {
            this.locale = header ? header.slice(0, 2) : this.options.defaultLocale || "en";
        }
    }
    async render(req) {
        await this.prepareLocale(req.headers.get("accept-language") || undefined);
        const jsx = /*#__PURE__*/ createElement(this.Component, {
            locale: this.locale,
            scriptTags: this.extractor?.getScriptTags(),
            linkTags: this.extractor?.getLinkTags()
        });
        return renderToReadableStream(jsx);
    }
};

const config = {
    supportsResponseStreaming: true
};
const Renderer = new Renderer$1(App, {
    htmlString
});
// const DemoComponent = ({ timeout=500 }) => {
//   const LazyButton = React.lazy(async () => {
//     await new Promise(resolve => setTimeout(resolve, timeout));
//
//     return {
//       default: () => <button>Click me</button>,
//     }
//   });
//
//   useEffect(() => {
//     console.log('mounted');
//   }, []);
//
//   return (
//     <div>
//       <React.Suspense fallback={<>Waitttt</>}>
//         <LazyButton onClick={() => alert('clicked')} />
//       </React.Suspense>
//     </div>
//   );
// }
const handler = Renderer.render;
async function GET(request) {
    new TextEncoder();
    const stream = await handler(request);
    // // Transform stream to uppercase
    // const transformStream = new TransformStream({
    //     async transform(chunk, controller) {
    //         const text = new TextDecoder().decode(chunk);
    //         controller.enqueue(encoder.encode(text.toUpperCase()));
    //     },
    // });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
}

export { GET, config, handler };
