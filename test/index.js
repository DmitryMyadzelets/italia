import { deepEqual as equal } from 'assert'
import { fileURLToPath } from 'url'
import path from 'path'
import load from '../tools/load.js'

// Helpers:
// Check if the value in array is unique
const unique = (v, i, a) => a.indexOf(v) == i

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
// Make a helper object with structure equal to the postcodes.json
let helper
;(() => {
  const compare = (a, b) => a.localeCompare(b)
  const convert = arr => arr.sort(compare).map(name => ({ name }))

  const regions = convert(Object.keys(italy))

  regions.forEach(region => {
    const provinces = convert(Object.keys(italy[region.name]))
    region.provinces = provinces

    provinces.forEach(province => {
      const comunes = convert(Object.keys(italy[region.name][province.name]))
      province.comunes = comunes
    })
  })

  helper = regions
})()
//
// We check if it's consistent with the reference data
// Make helper arrays
;(() => {
  const regions = 
    Object.keys(italy)
    .sort()

  const provinces = 
    Object.values(italy)
    .map(Object.keys)
    .reduce((arr, v) => arr.push(...v) && arr, [])
    .sort()

  const comunes = 
    Object.values(italy)
    .map(Object.values)
    .reduce((arr, v) => arr.push(...v
      .map(Object.keys)
      .reduce((arr, v) => arr.push(...v) && arr, [])) && arr, [])
    .sort()

  Object.assign(italy, { regions, provinces, comunes })
})()
// Amount of regions is the same
equal(regions.length, italy.regions.length)
// Names of regions are equal
italy.regions.forEach((name, i) => equal(name, regions[i]))
// Amount of provinces is the same
equal(provinces.length, italy.provinces.length)
// Names of provinces are equal
italy.provinces.forEach((name, i) => equal(name, provinces[i]))

console.log('Regions, total:', regions.length)
console.log('Provinces, total:', provinces.length)
console.log('Comunes, total:', italy.comunes.length)

// codes.json
//
const codes = await load(json('postcodes.json'))
// Amount of regions is the same
equal(regions.length, codes.length)
// Names of regions are equal
codes.forEach((region, i) => equal(region.name, regions[i]))

// codes - comunes
;(() => {
  // Amount of comunes is equal
  const inProvince = province => province.comunes.length
  const inRegion = region => region.provinces.reduce((sum, province) => sum + inProvince(province), 0)
  const nComunes = codes.reduce((sum, region) => sum += inRegion(region), 0)
  // Comunes per regions
  const perRegions = codes
    .map(region => ({name: region.name, comunes: inRegion(region)}))
    .sort((a, b) => a.name.localeCompare(b.name))
  //
  // equal(italy.comunes.length, nComunes) // It's not equal! 7904 vs 8143

  // Every actual comune has a postcode
  const reductor = f => (arr, o) => arr.push(...f(o)) && arr
  const comunesNames = o => o.comunes.map(o => o.name)
  const namesInRegion = o => o.provinces.reduce(reductor(comunesNames), [])
  // ... Names of comunes are not unique accross Italy, but per region they are
  const convert = region => ({name: region.name, comunes: namesInRegion(region)})
  const namesPerRegion = codes.map(convert)
  namesPerRegion.forEach(region => equal(true, region.comunes.every(unique)))
  // ... Names of comunes of the actual communes
  const helperComunes = helper.map(convert)
  helperComunes.forEach(region => {
    const sameRegion = namesPerRegion.find(({ name }) => name == region.name)
    equal(typeof sameRegion, 'object')
    region.comunes.forEach(name => {
      try {
        equal(sameRegion.comunes.find(v => v == name), name)
      } catch (e) {
        console.error('Error for:', region)
        throw e
      }
    })
  })
})()

// codes - provinces
;(() => {
  // Add new regions
  const sardegna = codes.find(region => region.name == 'Sardegna')
  sardegna.provinces.push({ name: 'Sud Sardegna', comunes: [] })
  // Remove  suppressed provinces
  const suppressed = ['Carbonia-Iglesias', 'Medio Campidano', 'Ogliastra', 'Olbia-Tempio']
  sardegna.provinces = sardegna.provinces.filter(({ name }) => suppressed.indexOf(name) < 0)
  //
  const toProvinces = (provinces, region) => provinces.push(...region.provinces.map(o => o.name)) && provinces
  const names = codes.reduce(toProvinces, []).sort()

  // Names of provinces is equal
  names.forEach((name, i) => equal(name, provinces[i]))
  // Amount of provinces is the same
  equal(provinces.length, names.length)
})()

const countProvinces = (sum, region) => sum + region.provinces.length
equal(provinces.length, codes.reduce(countProvinces, 0))
