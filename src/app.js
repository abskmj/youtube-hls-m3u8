const express = require('express')
const fetch = require('node-fetch')
const crypto = require('crypto')

const app = express()

const getLiveStream = async (url) => {
  const response = await fetch(url)

  if (response.ok) {
    const text = await response.text()
    const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g)?.[0]
    const name = text.match(/(?<=channelName":")[^"]*/g)?.[0]

    return { name, stream }
  } else {
    throw Error(`Youtube URL (${url}) failed with status: ${response.status}`)
  }
}

const track = async (user, event) => {
  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.GA_CLIENT_ID,
      user_id: user,
      events: [event]
    })
  })
}

app.use((req, res, nxt) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  req.user = crypto.createHash('sha256').update(ip).digest('hex')
  nxt()
})

app.get('/channel/:id.m3u8', async (req, res, nxt) => {
  try {
    const url = `https://www.youtube.com/channel/${req.params.id}/live`
    const { name, stream } = await getLiveStream(url)

    track(req.user, {
      name: 'feed',
      params: {
        engagement_time_msec: '1',
        name
      }
    })

    res.redirect(stream)
  } catch (err) {
    nxt(err)
  }
})

app.get('/video/:id.m3u8', async (req, res, nxt) => {
  try {
    const url = `https://www.youtube.com/watch?v=${req.params.id}`
    const { name, stream } = await getLiveStream(url)

    track(req.user, {
      name: 'feed',
      params: {
        engagement_time_msec: '1',
        name
      }
    })

    res.redirect(stream)
  } catch (err) {
    nxt(err)
  }
})

app.listen(3000, () => {
  console.log('Listen on the port 3000...')
})
