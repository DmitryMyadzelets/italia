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

  id = o[keys.comuneId]
  name = o[keys.comuneName]
  const comune = put(comunes, id, { id, name/*, region, province*/ })

  if (!region.provinces[province.id]) { region.provinces[province.id] = province }
  if (!province.comunes[comune.id]) { province.comunes[comune.id] = comune }
})

// Convert objects to arrays for JSON
const italy = Object.values(regions)

italy.forEach(region => {
  region.provinces = Object.values(region.provinces)
  region.provinces.forEach(province => province.comunes = Object.values(province.comunes))
})

console.log(JSON.stringify(italy, null, 2))
