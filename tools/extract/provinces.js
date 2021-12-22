import extract from './extract.js'
import keys from './config.js'

const data = extract(keys.province)
console.log(JSON.stringify(data, null, 2))
