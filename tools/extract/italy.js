import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import load from '../load.js'
import keys from './config.js'

const fname = resolve(dirname(fileURLToPath(import.meta.url)), '../../json/data.json')
const data = await load(fname)

const regions = {}
const provinces = {}
const comunes = {}

// Puts an object with given key to the distance object if it doesn't exist
const put = (dst, key, obj = {}) => dst[key] || (dst[key] = obj)

// Traverse all the source data in one pass and extract data
data.forEach(o => {
  let id, name

  id = o[keys.regionId]
  name = o[keys.regionName]
  const region = put(regions, id, { id, name, provinces: {} })

  id = o[keys.provinceId]
  name = o[keys.provinceName]
  const province = put(provinces, id, { id, name, comunes: {} })
  put(region.provinces, id, province)

  id = o[keys.comuneId]
  name = o[keys.comuneName]
  const comune = put(comunes, id, { id, name/*, region, province*/ })
  put(province.comunes, id, comune)
})

// Sorting helpers
const asStrings = (a, b) => a.localeCompare(b)
const byName = (a, b) => asStrings(a.name, b.name)

// Convert objects to arrays for JSON
const italy = Object.values(regions).sort(byName)

italy.forEach(region => {
  region.provinces = Object.values(region.provinces).sort(byName)
  region.provinces.forEach(province => {
    province.comunes = Object.values(province.comunes).sort(byName)
  })
})

console.log(JSON.stringify(italy, null, 2))
