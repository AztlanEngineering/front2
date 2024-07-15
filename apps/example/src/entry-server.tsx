// [REF 1.1]
import React from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';
import App from './App';
// import { StaticRouter } from 'react-router-dom/server';

// export const config = {
//   runtime: 'edge',
// };

export default async function Handler(req: Request) {
  let didError = false;

  const stream = await renderToReadableStream(<App
  //  req={req}
  />, {
    onError(err: unknown) {
      didError = true;
      console.error(err);
    },
  });


  console.log('stream', stream);

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
