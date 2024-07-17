import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useEffect } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';
import { parseDocument } from 'htmlparser2';

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
            if (node.children) {
                stack.push(...node.children);
            }
        }
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

const htmlString = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React</title>\n    <script type=\"module\" crossorigin src=\"/main.js\"></script>\n    <link rel=\"modulepreload\" crossorigin href=\"/assets/jsx-runtime-BxrnBPY-.js\">\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/main-DiwrgTda.css\">\n  </head>\n  <body>\n    <div id=\"root\"><!--app-html--></div>\n  </body>\n</html>\n";

// [REF 1.1]
const config = {
    supportsResponseStreaming: true
};
//
// export default async function Handler(req: Request) {
//   let didError = false;
//
//   const stream = await renderToReadableStream(<Application
//   //  req={req}
//   />, {
//     onError(err: unknown) {
//       didError = true;
//       console.error(err);
//     },
//   });
//
//   return new Response(stream, {
//     status: didError ? 500 : 200,
//     headers: { 'Content-Type': 'text/html' },
//   });
// }
const DemoComponent = ()=>{
    const LazyButton = /*#__PURE__*/ React.lazy(async ()=>{
        await new Promise((resolve)=>setTimeout(resolve, 0));
        return {
            default: ()=>/*#__PURE__*/ jsx("button", {
                    children: "Click me"
                })
        };
    });
    useEffect(()=>{
        console.log('mounted');
    }, []);
    return /*#__PURE__*/ jsx("div", {
        children: /*#__PURE__*/ jsx(React.Suspense, {
            fallback: /*#__PURE__*/ jsx(Fragment, {
                children: "Waitttt"
            }),
            children: /*#__PURE__*/ jsx(LazyButton, {
                onClick: ()=>alert('clicked')
            })
        })
    });
};
const Entry = ({ lang })=>{
    const extractor = new Extractor(htmlString);
    const linkTags = extractor.getLinkTags();
    const scriptTags = extractor.getScriptTags();
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
                    linkTags,
                    scriptTags
                ]
            }),
            /*#__PURE__*/ jsx("body", {
                children: /*#__PURE__*/ jsx("div", {
                    id: "root",
                    children: /*#__PURE__*/ jsx(DemoComponent, {})
                })
            })
        ]
    });
};
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
    const stream = await renderToReadableStream(/*#__PURE__*/ jsx(Entry, {}));
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
