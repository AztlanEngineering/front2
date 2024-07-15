import 'react';

// [REF 1.1]
// import { StaticRouter } from 'react-router-dom/server';
const config = {
    runtime: 'edge'
};
function handler(request, response) {
    return response.status(200).json({
        text: 'I am an Edge Function!'
    });
} // export default async function Handler(req: Request) {
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

export { config, handler as default };
