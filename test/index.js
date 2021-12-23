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

// Postcodes, year 2016
//
const codes2016 = await load(json('postcodes-2016.json'))
link(codes2016)
// Statistics should be equal
// equal(stats(codes2016), stat) // It's not equal! 8143 vs 7904

// Postcodes, year 2021
//
const codes2021 = await load(json('postcodes-2021.json'))
link(codes2021)
// Add missing province
;(regions => {
  const missing = 'Valle d\'Aosta/Vallée d\'Aoste'
  const region = regions.find(({ name }) => name == missing)
  equal(typeof region, 'object')
  region.provinces.push({ name: missing, comunes: [] })
})(codes2021)
// Statistics should be equal
equal(stats(codes2021), stat) // It's not. Less even provinces

const getProvinces = region => region.provinces
const provinces2021 = codes2021
  .map(getProvinces)
  .reduce((arr, v) => arr.push(...v) && arr, [])
  .map(name)
  .sort(asStrings)

provinces2021.sort(asStrings)
// Iterate over the largest array
provinces.forEach((name, i) => equal(provinces2021[i], name))
// 

// codes.json - provinces
;(() => {
  // Add new regions
  const sardegna = codes.find(region => region.name == 'Sardegna')
  sardegna.provinces.push({ name: 'Sud Sardegna', comunes: [] })
  // Remove  suppressed provinces
  const suppressed = ['Carbonia-Iglesias', 'Medio Campidano', 'Ogliastra', 'Olbia-Tempio']
  sardegna.provinces = sardegna.provinces.filter(({ name }) => suppressed.indexOf(name) < 0)
  // Make array of provinces' names
  const names = codes
    .map(({ provinces })=> provinces.map(name))
    .reduce((arr, names) => arr.push(...names) && arr, [])
    .sort(byName)
  // Names of provinces is equal
  provinces.forEach((name, i) => equal(name, names[i]))
  // Amount of provinces is the same
  equal(provinces.length, names.length)
})
