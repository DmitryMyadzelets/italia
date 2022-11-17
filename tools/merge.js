import { deepEqual as equal } from 'assert'
import path from 'path'
import { fileURLToPath } from 'url'
import load from './load.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const json = fname => path.resolve(dirname, '../json', fname)

const italy = await load(json('italy.json'))
const codes = await load(json('postcodes.json'))

const merge = (dst, src) => Object.assign(dst, src)
// Convert strings to array of numbers
const convert = s => s.split(' ').map(Number).filter(Number)

italy.forEach((region, i) =>
  region.provinces.forEach((province, j) =>
    province.comunes.forEach((comune, k) => {
      const src = codes[i].provinces[j].comunes[k]
      // Make sure we merge code from the same comune
      // equal(src.name, comune.name)
      equal(src.id, comune.id)
      merge(comune, { codes: convert(src.codes) })
    })
  )
)

console.log(JSON.stringify(italy, null, 2))
