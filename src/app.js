const express = require('express')
const fetch = require('node-fetch')

const cache = require('./cache')

const app = express()

const getLiveStream = async (url) => {
  let data = await cache.get(url)

  if (data) {
    return JSON.parse(data)
  } else {
    data = {}

    try {
      const response = await fetch(url)

      if (response.ok) {
        const text = await response.text()
        const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/)?.[0]
        const name = text.match(/(?<=ownerChannelName":")[^"]*/)?.[0]
        const logo = text.match(/(?<=owner":{"videoOwnerRenderer":{"thumbnail":{"thumbnails":\[{"url":")[^=]*/)?.[0]

        data = { name, stream, logo }
      }
    } catch (error) {
      console.log(error)
    }

    await cache.set(url, JSON.stringify(data), { EX: 300 })

    return data
  }
}

// const { GA_MEASUREMENT_ID, GA_API_SECRET, GA_CLIENT_ID } = process.env

// const track = (user, event) => {
//   return fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
//     method: 'POST',
//     body: JSON.stringify({
//       client_id: GA_CLIENT_ID,
//       user_id: user.id,
//       events: [event, {
//         name: 'client',
//         params: user.properties
//       }]
//     })
//   })
// }

app.use(require('express-status-monitor')())

// app.use((req, res, nxt) => {
//   // console.log('headers:', req.headers)

//   req.user = {
//     id: req.headers['cf-connecting-ip'] || req.ip,
//     properties: {
//       country: req.headers['cf-ipcountry'],
//       ua: req.headers['user-agent']
//     }
//   }

//   nxt()
// })

app.get('/channel/:id.m3u8', async (req, res, nxt) => {
  try {
    const url = `https://www.youtube.com/channel/${req.params.id}/live`
    const { name, stream } = await getLiveStream(url)

    // await track(req.user, {
    //   name: 'feed',
    //   params: {
    //     engagement_time_msec: '1',
    //     name
    //   }
    // })

    if (stream) {
      res.redirect(stream)
    } else {
      res.sendStatus(204)
    }
  } catch (err) {
    nxt(err)
  }
})

app.get('/video/:id.m3u8', async (req, res, nxt) => {
  try {
    const url = `https://www.youtube.com/watch?v=${req.params.id}`
    const { name, stream } = await getLiveStream(url)

    // await track(req.user, {
    //   name: 'feed',
    //   params: {
    //     engagement_time_msec: '1',
    //     name
    //   }
    // })

    if (stream) {
      res.redirect(stream)
    } else {
      res.sendStatus(204)
    }
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
      const data = JSON.parse(await cache.get(key))

      if (data) {
        items.push({
          url: key,
          name: data.name,
          logo: data.logo
        })
      }
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
