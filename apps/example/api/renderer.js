import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React, { useState } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';
import { parseDocument } from 'htmlparser2';

const reactLogo = "/assets/react-CHdo91hT.svg";

const viteLogo = "/vite.svg";

function App({ lang = 'en', extractor }) {
    return /*#__PURE__*/ jsxs("html", {
        lang: lang,
        children: [
            /*#__PURE__*/ jsxs("head", {
                children: [
                    /*#__PURE__*/ jsx("meta", {
                        charset: "UTF-8"
                    }),
                    /*#__PURE__*/ jsx("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0"
                    }),
                    /*#__PURE__*/ jsx("title", {
                        children: "React Server Components"
                    }),
                    extractor?.getLinkTags(),
                    extractor?.getScriptTags()
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
                    /*#__PURE__*/ jsxs("p", {
                        children: [
                            "Edit ",
                            /*#__PURE__*/ jsx("code", {
                                children: "src/App.jsx"
                            }),
                            " and save to test HMR2 Change here 9        "
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

/**
 * Parses an HTML string to extract and convert script and link tags to React.createElement calls.
 */ class Extractor {
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
            if (node.type === 'tag' && node.name === tagName) {
                elements.push(node);
            }
            // Check for script tags specifically
            if (node.type === 'script' && tagName === 'script') {
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
        return React.createElement(element.name, props);
    }
    getLinkTags() {
        const linkElements = this.getElementsByTagName('link');
        return linkElements.map(this.convertToReactElement);
    }
    getScriptTags() {
        const scriptElements = this.getElementsByTagName('script');
        return scriptElements.map(this.convertToReactElement);
    }
}

const htmlString = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React</title>\n    <script type=\"module\" crossorigin src=\"/main.js\"></script>\n    <link rel=\"modulepreload\" crossorigin href=\"/assets/Application-CYEYQ4T_.js\">\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/Application-Bx9V9zN2.css\">\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/main-BPvgi06w.css\">\n  </head>\n  <body>\n    <div id=\"root\"><!--app-html--></div>\n  </body>\n</html>\n";

// [REF 1.1]
const config = {
    supportsResponseStreaming: true
};
const Entry = App;
// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   // res.socket.on('error', (error) => {
//   //   console.error('Fatal', error);
//   // });
//
//   // Render React component to pipeable stream
//   const { pipe, abort } = renderToPipeableStream(
//     <Entry />,
//     {
//       onShellReady() {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/html');
//         pipe(res);
//       },
//       onErrorShell(error) {
//         res.statusCode = 500;
//         res.send(
//           `<!doctype html><p>An error occurred:</p><pre>${error.message}</pre>`
//         );
//       },
//     }
//   );
//   // const stream = await renderToReadableStream(
//   //   <Entry />,
//   // );
//
//   // let text = '';
//   // let numChunks = 0;
//   // for await (const chunk of stream) {
//   //   text += new TextDecoder().decode(chunk);
//   //   numChunks++;
//   //   console.log('chunk', numChunks, text.length, text);
//   // }
//
//   return { pipe, abort };
// }
async function GET() {
    new TextEncoder();
    const stream = await bunHandler();
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
async function bunHandler() {
    const extractor = new Extractor(htmlString);
    const stream = await renderToReadableStream(/*#__PURE__*/ jsx(Entry, {
        lang: 'en',
        extractor: extractor
    }));
    // let text = '';
    // let numChunks = 0;
    // for await (const chunk of stream) {
    //   text += new TextDecoder().decode(chunk);
    //   numChunks++;
    //   console.log('chunk', numChunks, text.length, text);
    // }
    return stream;
}

export { GET, bunHandler, config };
