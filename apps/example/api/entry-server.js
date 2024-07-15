import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';

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
                            " and save to test HMR Change here"
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
// import { StaticRouter } from 'react-router-dom/server';
const config = {
    runtime: 'edge'
};
async function Handler(req) {
    let didError = false;
    const stream = await renderToReadableStream(/*#__PURE__*/ jsx(App, {}), {
        onError (err) {
            didError = true;
            console.error(err);
        }
    });
    console.log('stream', stream);
    return new Response(stream, {
        status: didError ? 500 : 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

export { config, Handler as default };
