import { jsx, Fragment } from 'react/jsx-runtime';
import React, { useEffect } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { renderToReadableStream } from 'react-dom/server.browser';

// [REF 1.1]
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
        await new Promise((resolve)=>setTimeout(resolve, 500));
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
const Entry = DemoComponent;
async function handler(req, res) {
    // res.socket.on('error', (error) => {
    //   console.error('Fatal', error);
    // });
    // Render React component to pipeable stream
    const { pipe, abort } = renderToPipeableStream(/*#__PURE__*/ jsx(Entry, {}), {
        onShellReady () {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            pipe(res);
        },
        onErrorShell (error) {
            res.statusCode = 500;
            res.send(`<!doctype html><p>An error occurred:</p><pre>${error.message}</pre>`);
        }
    });
    // const stream = await renderToReadableStream(
    //   <Entry />,
    // );
    // let text = '';
    // let numChunks = 0;
    // for await (const chunk of stream) {
    //   text += new TextDecoder().decode(chunk);
    //   numChunks++;
    //   console.log('chunk', numChunks, text.length, text);
    // }
    return {
        pipe,
        abort
    };
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

export { bunHandler, handler as default };
