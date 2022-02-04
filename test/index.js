import { deepEqual as equal } from 'assert'
import { fileURLToPath } from 'url'
import path from 'path'
import load from '../tools/load.js'
import link from './link.js'
import stats from './stats.js'
import lookup from './lookup.js'
import validate from './validate.js'

// Helpers:
// Check if the value in array is unique
const unique = (v, i, a) => a.indexOf(v) == i
// Sorting by name function
const asStrings = (a, b) => a.localeCompare(b)
const byName = (a, b) => asStrings(a.name, b.name)
const name = ({ name }) => name

const dirname = path.dirname(fileURLToPath(import.meta.url))
const json = fname => path.resolve(dirname, '../json', fname)

// italy.json
//
const italy = await load(json('italy.json'))
link(italy)
// Names of comunes are unique across every region
italy.forEach(region => equal(region.comunes.map(name).every(unique), true))
// Names of comunes aren't unique across italy
equal(italy.reduce((arr, { comunes }) => arr.push(...comunes) && arr, []).map(name).every(unique), false)
// Report
const stat = stats(italy)
console.log('Statistics:', stat)
// The ids of the comunes are unique
equal(italy
  .reduce((arr, region) => arr.push(...region.comunes) && arr, [])
  .map(comune => comune.id)
  .every(unique), true)

// Postcodes
//
const codes = await load(json('postcodes.json'))
link(codes)
// Statistics should be equal
equal(stats(codes), stat)
// Names of provinces and comunes are equal
italy.forEach((region, i) => {
  equal(codes[i].name, region.name)

  region.provinces.forEach((province, j) => {
    equal(codes[i].provinces[j].name, province.name)

    province.comunes.forEach((comune, k) => {
      const c = codes[i].provinces[j].comunes[k]
      equal(c.name, comune.name)
      equal(c.codes.length > 0, true)
    })
  })
})

const merged = await load(json('merged.json'))
// 
equal(lookup(merged)(40122), [{
  name: 'Bologna',
  id: 'A944',
  codes: [40121, 40141]
}])

// Validate JSON schemas
merged.forEach(region => {
  validate.region(region)
  region.provinces.forEach(province => {
    validate.province(province)
    province.comunes.forEach(comune => {
      validate.comune(comune)
    })
  })
})
