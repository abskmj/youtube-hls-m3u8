const redis = require('redis')

let client;

(async () => {
  client = redis.createClient({ url: process.env.REDIS_URL })

  client.on('error', (error) => console.error(`Error : ${error}`))

  await client.connect()
})()

module.exports = client
