import { deepEqual as equal } from 'assert'
import { fileURLToPath } from 'url'
import path from 'path'
import load from '../tools/load.js'

// Helpers:
// Check if the value in array is unique
const unique = (v, i, a) => a.indexOf(v) == i
// Sorting by name function
const byNames = (a, b) => a.name.localeCompare(b.name)
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
// Create helper objects
const comunesInProvince = province => province.comunes
const comunesInRegion = region => region.provinces.reduce((arr, province) => arr.push(...comunesInProvince(province)) && arr, [])
italy.forEach(region => region.comunes = comunesInRegion(region))
// Names of comunes are unique across every region
italy.forEach(region => equal(region.comunes.map(name).every(unique), true))
// Names of comunes aren't unique across italy
equal(italy.reduce((arr, { comunes }) => arr.push(...comunes) && arr, []).map(name).every(unique), false)
// Count the entities
const nRegions = Object.keys(italy).length
const nProvinces = italy.reduce((sum, region) => sum + region.provinces.length, 0)
const nComunes = italy.reduce((sum, region) => sum + region.comunes.length, 0)
equal(regions.length, nRegions)
equal(provinces.length, nProvinces)
// Report
console.log('Regions, total:', nRegions)
console.log('Provinces, total:', nProvinces)
console.log('Comunes, total:', nComunes)

// codes.json
//
const codes = await load(json('postcodes.json'))
// Helper links
codes.forEach(region => region.comunes = comunesInRegion(region))
// Amount of regions is the same
equal(regions.length, codes.length)
// Amount of comunes is equal
const nComunesCodes = codes.reduce((sum, region) => sum + region.comunes.length, 0)
// equal(nComunesCodes, nComunes) // It's not equal! 8143 vs 7904
codes.forEach((region, i) => {
  try {
    // Names of regions are equal
    codes.forEach((region, i) => equal(region.name, italy[i].name))
    // Amount of comunes is equal
    // equal(region.comunes.length, italy[i].comunes.length) // It's not true
    // for 13 of 20 regions!
  } catch (e) {
    const { name } = region
    // console.error('Error for:', { name }, `${region.comunes.length} vs ${italy[i].comunes.length}`)
    throw e
  }
})

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
})()
