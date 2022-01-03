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
const put = (obj, key, val = {}) => obj[key] || (obj[key] = val)

// Traverse all the source data in one pass and extract data
data.forEach(o => {
  let id, name

  id = o[keys.regionId]
  name = o[keys.regionName]
  const region = put(regions, id, { name, provinces: {} })

  id = o[keys.provinceId]
  name = o[keys.provinceName]
  const province = put(provinces, id, { name, comunes: {} })
  put(region.provinces, id, province)

  id = o[keys.comuneId]
  name = o[keys.comuneName]
  const comune = put(comunes, id, { name/*, region, province*/ })
  put(province.comunes, id, comune)
})

// Sorting helpers
const asStrings = (a, b) => a.localeCompare(b)
const byName = (a, b) => asStrings(a.name, b.name)

// Convert objects to arrays for JSON
function convert (regions) {
  const toObject = ([id, obj]) => Object.assign({ id }, obj)
  const toArray = obj => Object.entries(obj).map(toObject).sort(byName)

  const italy = toArray(regions)
  italy.forEach(region => {
    region.provinces = toArray(region.provinces)
    region.provinces.forEach(province => province.comunes = toArray(province.comunes))
  })
  return italy
}

const italy = convert(regions)
console.log(JSON.stringify(italy, null, 2))
