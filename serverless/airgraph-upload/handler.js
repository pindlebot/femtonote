const crypto = require('crypto')
const AWS = require('aws-sdk')
const mime = require('mime-types')
const safeKey = require('safe-s3-key')

const s3 = new AWS.S3({
  region: 'us-east-1'
})

module.exports.post = async (event, context, callback) => {
  let name = crypto.randomBytes(10).toString('hex')
  let data = JSON.parse(event.body)
  console.log(data)
  let { token, filename, body } = data
  filename = safeKey(filename)
  let sub = JSON.parse(Buffer.from(token, 'base64').toString('utf8')).sub
  let key = `${sub}/${filename}`
  let buffer = Buffer.from(body, 'base64')

  await s3.putObject({
    Body: buffer,
    Bucket: 'airgraph',
    Key: key,
    ContentType: mime.lookup(key)
  }).promise()

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify({
      success: true,
      filename: filename,
      key: key,
      url: `https://s3.amazonaws.com/airgraph/${key}`
    })
  })
}

module.exports.get = async (event, context, callback) => {
  let path = event.path.slice(5, event.path.length)
  let key = decodeURIComponent(path)
  
  console.log({ event, key })
  let { Body } = await s3.getObject({
    Key: key,
    Bucket: 'airgraph'
  }).promise().catch(console.log.bind(console))
  console.log(Body)
  let data = Body.toString('utf8')
  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json'
    },
    body: data
  })
}
