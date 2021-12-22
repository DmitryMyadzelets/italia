import extract from './extract.js'
import keys from './config.js'

const data = extract(keys.region)
console.log(JSON.stringify(data, null, 2))
