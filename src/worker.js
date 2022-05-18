/* global addEventListener, Response */

addEventListener('fetch', (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.message, { status: 500 })
    )
  )
})

async function handleRequest (request) {
  const { pathname } = new URL(request.url)

  if (pathname.startsWith('/channel/')) {
    // supported api /channel/:id.m3u8
    const channel = pathname.split('/')?.[2]?.split('.')?.[0]

    if (channel !== '') {
      const url = `https://youtube.com/channel/${channel}/live`
      const response = await fetch(url)

      if (response.ok) {
        const text = await response.text()
        const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g)

        const data = {
          channel,
          stream
        }

        const json = JSON.stringify(data, null, 2)

        return new Response(json, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        })
      } else {
        throw Error(`Youtube URL (${url}) failed with status: ${response.status}`)
      }
    } else {
      throw Error(`Channel ID not found: ${pathname}`)
    }
  } else {
    throw Error(`Path not found: ${pathname} `)
  }
}
