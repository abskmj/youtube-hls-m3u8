const express = require('express')
const fetch = require('node-fetch')

const app = express()

const getLiveStream = async (url) => {
  const response = await fetch(url)

  if (response.ok) {
    const text = await response.text()
    const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g)

    return stream?.[0]
  } else {
    throw Error(`Youtube URL (${url}) failed with status: ${response.status}`)
  }
}

const track = async (event) => {
  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.GA_CLIENT_ID,
      events: [event]
    })
  })
}

app.get('/channel/:id.m3u8', async (req, res, nxt) => {
  try {
    track({
      name: 'feed',
      params: { channel: req.params.id }
    })

    const url = `https://www.youtube.com/channel/${req.params.id}/live`
    const stream = await getLiveStream(url)

    res.redirect(stream)
  } catch (err) {
    nxt(err)
  }
})

app.get('/video/:id.m3u8', async (req, res, nxt) => {
  try {
    track({
      name: 'feed',
      params: { video: req.params.id }
    })

    const url = `https://www.youtube.com/watch?v=${req.params.id}`
    const stream = await getLiveStream(url)

    res.redirect(stream)
  } catch (err) {
    nxt(err)
  }
})

app.listen(3000, () => {
  console.log('Listen on the port 3000...')
})
