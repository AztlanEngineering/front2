import React from 'react';
import Application from './app/Application';

import htmlString from '../dist/client/index.html?raw';
// import { StaticRouter } from 'react-router-dom/server';
//
import { VercelRequest, VercelResponse } from '@vercel/node';
import { JSXRenderer } from '@aztlan/react-ssr';

export const config = {
  supportsResponseStreaming: true,
};

const Renderer = new JSXRenderer(Application, {
  htmlString,
})

// const DemoComponent = () => {
//   const LazyButton = React.lazy(async () => {
//     await new Promise(resolve => setTimeout(resolve, 0));
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



export const handler = Renderer.render

export async function GET() {
    const encoder = new TextEncoder();
    const stream = await handler();

    // // Transform stream to uppercase
    // const transformStream = new TransformStream({
    //     async transform(chunk, controller) {
    //         const text = new TextDecoder().decode(chunk);
    //         controller.enqueue(encoder.encode(text.toUpperCase()));
    //     },
    // });

    return new Response(stream, {
    headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}

