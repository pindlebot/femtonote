const fetch = require('node-fetch')
const url = 'https://cbld8d8gvk.execute-api.us-east-1.amazonaws.com/prod/123.json'
const fs = require('fs')

async function test () {
  let raw = await new Promise((resolve, reject) =>
    fs.readFile('package.json', { encoding: 'base64' }, (err, data) => {
      resolve(data)
    })
  )
  fetch(url, {
    method: 'POST',
    body: raw,
    headers: {
    }
  })
    .then(resp => resp.json())
    .then(console.log.bind(console))
}

test()