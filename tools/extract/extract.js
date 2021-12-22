import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import load from '../load.js'

// The following methods give same results. Using Set is a little faster
// const unique = (v, i, a) => a.indexOf(v) == i
// const byKey = key => arr => arr.map(obj => obj[key]).filter(unique)
const byKey = key => arr => [... new Set(arr.map(obj => obj[key]))]

const fname = resolve(dirname(fileURLToPath(import.meta.url)), '../../json/data.json')
const data = await load(fname)
const extract = key => byKey(key)(data).sort()

export default extract
