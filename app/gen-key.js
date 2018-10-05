const seenKeys = {};
const MULTIPLIER = Math.pow(2, 24)

function genKey() {
  let key
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32)
  }
  seenKeys[key] = true
  return key
}

export default genKey
