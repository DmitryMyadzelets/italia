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

// Traverse all the source data in one pass
data.forEach(o => {
  let id, name

  id = o[keys.regionId]
  name = o[keys.regionName]
  const region = put(regions, id, { id, name })

  id = o[keys.provinceId]
  name = o[keys.provinceName]
  const province = put(provinces, id, { id, name })

  id = o[keys.comuneId]
  name = o[keys.comuneName]
  const comune = put(comunes, id, { id, name, region, province })
})

console.log(Object.keys(regions).length, Object.keys(provinces).length, Object.keys(comunes).length)
//console.log(comunes)

//console.log(JSON.stringify(italy, null, 2))
