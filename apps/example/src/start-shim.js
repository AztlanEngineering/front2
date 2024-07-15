// addEventListener('fetch', event => {
//   const response = new Response('<h1>Hello, World!</h1>', {
//     headers: { 'Content-Type': 'text/html' },
//   });
//   event.respondWith(response);
// });

import Handler from '../api/entry-server.js';

addEventListener('fetch', (event) => {
  return event.respondWith(Handler(event.request));
});
