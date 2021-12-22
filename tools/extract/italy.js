import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import load from '../load.js'
import keys from './config.js'

const fname = resolve(dirname(fileURLToPath(import.meta.url)), '../../json/data.json')
const data = await load(fname)

// Firstly we build a tree of names in one pass

const child = (parent, key) => parent[key] || (parent[key] = {})

const namesTree = data => data.reduce((italy, o) => {
  const region = o[keys.region]
  const province = o[keys.province]
  const comune = o[keys.comune]

  child(child(child(italy, region), province), comune)

  return italy
}, {})

const names = namesTree(data)

// Convert the names tree to arrays of objects

const compare = (a, b) => a.localeCompare(b)
const convert = arr => arr.sort(compare).map(name => ({ name }))

const regions = convert(Object.keys(names))

regions.forEach(region => {
  const provinces = convert(Object.keys(names[region.name]))
  region.provinces = provinces

  provinces.forEach(province => {
    const comunes = convert(Object.keys(names[region.name][province.name]))
    province.comunes = comunes
  })
})

console.log(JSON.stringify(regions, null, 2))
