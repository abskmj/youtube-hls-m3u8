const redis = require('redis')

let client;

(async () => {
  const { REDIS_URL } = process.env

  // initilize client if url is set
  if (REDIS_URL) {
    client = redis.createClient({ url: REDIS_URL })

    client.on('error', (error) => console.error(`Error : ${error}`))

    await client.connect()
  }
})()

module.exports = client
