// [REF 1.1]
import React from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';
import App from './App';
// import { StaticRouter } from 'react-router-dom/server';
// 
import type { VercelRequest, VercelResponse } from '@vercel/node';


export const config = {
  runtime: 'edge', // this is a pre-requisite
};

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  return response.status(200).json({ text: 'I am an Edge Function!' });
}
// export default async function Handler(req: Request) {
//   let didError = false;
//
//   const stream = await renderToReadableStream(<App
//   //  req={req}
//   />, {
//     onError(err: unknown) {
//       didError = true;
//       console.error(err);
//     },
//   });
//
//
//   console.log('stream', stream);
//
//   return new Response(stream, {
//     status: didError ? 500 : 200,
//     headers: { 'Content-Type': 'text/html' },
//   });
// }
