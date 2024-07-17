// [REF 1.1]
import React from 'react';
import { useEffect } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';
import Application from '../app/Application';

import Extractor from './extractor';
import htmlString from '../../dist/client/index.html?raw';
// import { StaticRouter } from 'react-router-dom/server';
//
import { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  supportsResponseStreaming: true,
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
const DemoComponent = () => {
  const LazyButton = React.lazy(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    return {
      default: () => <button>Click me</button>,
    }
  });

  useEffect(() => {
    console.log('mounted');
  }, []);

  return (
    <div>
      <React.Suspense fallback={<>Waitttt</>}>
        <LazyButton onClick={() => alert('clicked')} />
      </React.Suspense>
    </div>
  );
}



const Entry = Application;

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

export async function GET() {
    const encoder = new TextEncoder();
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
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}

export async function bunHandler() {
  const extractor = new Extractor(htmlString)
  const stream = await renderToReadableStream(
    <Entry lang={'en'} extractor={extractor}/>,
  );

  // let text = '';
  // let numChunks = 0;
  // for await (const chunk of stream) {
  //   text += new TextDecoder().decode(chunk);
  //   numChunks++;
  //   console.log('chunk', numChunks, text.length, text);
  // }

  return stream;
}
