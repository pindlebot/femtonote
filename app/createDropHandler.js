import 'isomorphic-fetch'

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    }, false)

    reader.readAsDataURL(file)
  })

const ENDPOINT = 'https://cbld8d8gvk.execute-api.us-east-1.amazonaws.com/prod/post'

const dropHandler = async files => {
  let promises = files.map(async file => {
    let dataURL = await readAsDataURL(file)
    let body = dataURL.split(',')[1]
    return fetch(ENDPOINT, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
        filename: [Date.now(), file.name].join('-'),
        body
      }),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => ({
        ...data,
        dataURL
      }))
  })
  return Promise.all(promises)
}

export default dropHandler
