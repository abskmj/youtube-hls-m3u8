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

app.get('/channel/:id.m3u8', async (req, res, nxt) => {
  try {
    const url = `https://www.youtube.com/channel/${req.params.id}/live`
    const stream = await getLiveStream(url)

    res.redirect(stream)
  } catch (err) {
    nxt(err)
  }
})

app.get('/video/:id.m3u8', async (req, res, nxt) => {
  try {
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
