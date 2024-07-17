import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useEffect } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';

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
        await new Promise((resolve)=>setTimeout(resolve, 50));
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
                    })
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
