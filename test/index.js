import { deepEqual as equal } from 'assert'
import { fileURLToPath } from 'url'
import path from 'path'
import load from '../tools/load.js'
import link from './link.js'
import stats from './stats.js'

// Helpers:
// Check if the value in array is unique
const unique = (v, i, a) => a.indexOf(v) == i
// Sorting by name function
const byName = (a, b) => a.name.localeCompare(b.name)
const asStrings = (a, b) => a.localeCompare(b)
const name = ({ name }) => name

const dirname = path.dirname(fileURLToPath(import.meta.url))
const json = fname => path.resolve(dirname, '../json', fname)

// Load reference data
// Note: The names of regions are assumed to be sorted
const regions = await load(json('regions.json'))
const provinces = await load(json('provinces.json'))
equal(true, regions.length > 0)
equal(true, provinces.length > 0)
equal(true, regions.every(unique))
equal(true, provinces.every(unique))

// italy.json
//
const italy = await load(json('italy.json'))
link(italy)
// Names of comunes are unique across every region
italy.forEach(region => equal(region.comunes.map(name).every(unique), true))
// Names of comunes aren't unique across italy
equal(italy.reduce((arr, { comunes }) => arr.push(...comunes) && arr, []).map(name).every(unique), false)
// Count the entities
const stat = stats(italy)
equal(regions.length, stat.total.regions)
equal(provinces.length, stat.total.provinces)
// Report
console.log('Statistics:', stat)

// Postcodes, year 2021
//
const codes2021 = await load(json('postcodes.json'))
link(codes2021)
// Statistics should be equal
 equal(stats(codes2021), stat)
// Names of regions are equal
regions.forEach((name, i) => equal(codes2021[i].name, name))

// Names of provinces and comunes are equal
italy.forEach((region, i) => region.provinces.forEach((province, j) => {
  equal(codes2021[i].provinces[j].name, province.name)
  province.comunes.forEach((comune, k) => {
    const c = codes2021[i].provinces[j].comunes[k]
    equal(c.name, comune.name)
    equal(c.codes.length >= 5, true)
  })
}))
