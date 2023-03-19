const express = require('express')
const fetch = require('node-fetch')

const cache = require('./cache')

const app = express()

const getLiveStream = async (url) => {
  const data = await cache.get(url)

  if (data) {
    // console.log('using data from cache:', url)
    return JSON.parse(data)
  } else {
    const response = await fetch(url)

    if (response.ok) {
      const text = await response.text()
      const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g)?.[0]
      const name = text.match(/(?<=channelName":")[^"]*/g)?.[0]

      const data = { name, stream }

      await cache.set(url, JSON.stringify(data), { EX: 300 })

      return data
    } else {
      throw Error(`Youtube URL (${url}) failed with status: ${response.status}`)
    }
  }
}

const track = async (user, event) => {
  // console.log('track:', user, event)

  await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.GA_CLIENT_ID,
      user_id: user.id,
      events: [event, {
        name: 'client',
        params: user.properties
      }]
    })
  })
}

app.use(require('express-status-monitor')())

app.use((req, res, nxt) => {
  // console.log('headers:', req.headers)

  req.user = {
    id: req.headers['cf-connecting-ip'] || req.ip,
    properties: {
      country: req.headers['cf-ipcountry'],
      ua: req.headers['user-agent']
    }
  }

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

app.get('/cache', async (req, res, nxt) => {
  try {
    const keys = await cache.keys('*')
    // console.log('Keys:', keys)

    const items = []

    for (const key of keys) {
      const data = await cache.get(key)

      items.push({
        url: key,
        name: (JSON.parse(data)).name
      })
    }

    res.json(items)
  } catch (err) {
    nxt(err)
  }
})

app.listen(3000, () => {
  console.log('express app is running on port 3000')
  console.log(process.version)
})
