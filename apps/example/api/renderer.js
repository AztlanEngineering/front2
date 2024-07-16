import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

const reactLogo = "/assets/react-CHdo91hT.svg";

const viteLogo = "/vite.svg";

function App() {
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
                            " and save to test HMR2 Change here 90        "
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
}

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
async function handler(req, res) {
    res.socket.on('error', (error)=>{
        console.error('Fatal', error);
    });
    // Render React component to pipeable stream
    const { pipe, abort } = renderToPipeableStream(/*#__PURE__*/ jsx(App, {}), {
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
}

export { handler as default };
