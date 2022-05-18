/* global addEventListener, Response */

addEventListener('fetch', (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { status: 500 })
      )
    )
  })
  
  async function handleRequest (request) {
    const { pathname } = new URL(request.url)
  
    if (pathname.startsWith('/channel')) {
      
    }
  
    const data = {
      hello: 'world',
    };
  
    const json = JSON.stringify(data, null, 2);
  
    return new Response(json, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  }
  