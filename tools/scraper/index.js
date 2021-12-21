import { parseDocument as parse } from 'htmlparser2'
import { getElementsByTagName as select, textContent } from 'domutils'

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import cached from './get-cached.js'

import config from './.config.js'
const { host, path } = config

const get = cached({
  debug: false,
  dir: resolve(dirname(fileURLToPath(import.meta.url)), './.cache')
})

// Helper
// Traverse all children till no tags left. Returns the last element
const skipTags = e => {
  const tag = e.children.find(e => e.type == 'tag')
  return tag ? skipTags(tag) : e
}

// Helper
// Returns true if the element has given class
const classed = className => e => e.attribs.class && e.attribs.class.includes(className)
// Returns true if the element has givin id
const id = s => e => e.attribs.id == s

async function getCodes(path, tableClass) {
  const data = []

  let page = await get(host, path)
  page = parse(page)

  const divs = select('div', page).filter(id('jk'))
  const tables = select('table', page).filter(tableClass)

  select('tr', tables)
    .map(tr => select('td', tr))
    .filter(tds => tds.length > 0)
    .map(tds => select('a', tds[0])[0])
    .filter(a => !!a)
    .forEach(a => {
      const name = textContent(skipTags(a))
      const path = a.attribs.href
      data.push({ name, path })
    })

  return data
}

async function getProvinces(region) {
  const provinces = await getCodes(region.path, classed('ut'))
  region.provinces =  provinces
}

async function getComunes(province) {
  const comunes = await getCodes(province.path, classed('at'))
  province.comunes = comunes
}


let regions = await getCodes(path, classed('vm'))
regions = regions.filter(region => region.name == 'Sardegna')
await Promise.all(regions.map(getProvinces))
await Promise.all(regions.map(({ provinces }) => Promise.all(provinces.map(getComunes))))

// Remove unnecessary words in names
;(() => {
  const fix = province => province.name = province.name
    .replace('Città Metropolitana di ', '')
    .replace('Provincia di ', '')
    .replace('Provincia del ', '')
  regions.forEach(region => region.provinces.forEach(fix))
})()

// Fix names in upper case only
;(() => {
  const fix = comune => {
    const name = comune.name
    if (name == name.toUpperCase()) {
      let fixed = name[0] + name.slice(1).toLowerCase()
      comune.name = fixed
    }
  }
  regions.forEach(region => region.provinces.forEach(province => province.comunes.forEach(fix)))
})()

// Remove url
const noPath = o => delete o.path

regions.forEach(region => {
  noPath(region)
  region.provinces.forEach(province => {
    noPath(province)
    province.comunes.forEach(noPath)
  })
})

console.log(JSON.stringify(regions, null, 2))
