/* global addEventListener, Response */

addEventListener('fetch', (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.message, { status: 500 })
    )
  )
})

async function getLiveStream(url) {
  const response = await fetch(url)

  if (response.ok) {
    const text = await response.text()
    const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g)

    return stream
  } else {
    throw Error(`Youtube URL (${url}) failed with status: ${response.status}`)
  }
}

async function handleRequest(request) {
  const { pathname } = new URL(request.url)

  if (pathname.startsWith('/channel/')) {
    // supported api /channel/:id.m3u8
    const channel = pathname.split('/')?.[2]?.split('.')?.[0]

    if (channel !== '') {
      const url = `https://www.youtube.com/channel/${channel}/live`
      const stream = await getLiveStream(url)
      return Response.redirect(stream, 302)
    } else {
      throw Error(`Channel ID not found: ${pathname}`)
    }
  } else if (pathname.startsWith('/video/')) {
    // supported api /video/:id.m3u8
    const video = pathname.split('/')?.[2]?.split('.')?.[0]

    if (video !== '') {
      const url = `https://www.youtube.com/watch?v=${video}`
      const stream = await getLiveStream(url)
      return Response.redirect(stream, 302)
    } else {
      throw Error(`Video ID not found: ${pathname}`)
    }
  } else {
    throw Error(`Path not found: ${pathname} `)
  }
}
