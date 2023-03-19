const redis = require('redis')

let client;

(async () => {
  client = redis.createClient({ url: 'redis://red-cg8alh1mbg53mc4vg7h0:6379' })

  client.on('error', (error) => console.error(`Error : ${error}`))

  await client.connect()
})()

module.exports = client
