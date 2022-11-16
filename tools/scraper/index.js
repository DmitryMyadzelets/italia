import { deepEqual as equal } from 'assert'
import { parseDocument as parse } from 'htmlparser2'
import { getElementsByTagName as select, textContent } from 'domutils'

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import cached from './get-cached.js'

import config from './.config.js'
const { host, path } = config

const get = cached({
  debug: true,
  tout: true,
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

// Downloads and returns the parsed page 
async function getParsed(path) {
  let page = await get(host, path)
  return parse(page)
}

// Returns array of administrative entities from the given page 
function getEntities(page, tableClass) {
  const data = []

  const divs = select('div', page).filter(id('jk'))
  const tables = select('table', divs).filter(tableClass)
  const table = tables[0]

  select('tr', table)
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

// Returns array of provinces [{name, url}] from the given page
// Note:
// In the region pages there are two tables of provinces. This method is more
// reliable, as the second table is missing for some regions (see
// https://www.tuttitalia.it/valle-d-aosta/)
function getProvincesList(page) {
  const data = []
  const divs = select('div', page).filter(id('ea'))
  const tables = select('table', divs).filter(classed('af'))

  equal(tables.length, 1)

  select('a', tables)
    .forEach(a => {
      const name = textContent(skipTags(a))
      const path = a.attribs.href
      data.push({ name, path })
    })

  return data
}

async function getCap(comune) {
  let page = await get(host, comune.path)
  page = parse(page)
  const tables = select('table', page).filter(classed('uj'))

  const codes = select('tr', tables)
    .map(tr => select('td', tr))
    .filter(tds => tds.length >= 2)
    .filter(tds => textContent(skipTags(tds[0])) == 'CAP')
    .map(tds => textContent(skipTags(tds[1])))[0]

  equal(typeof codes, 'string')
  equal(codes.length > 0, true)
  comune.codes = codes
}

async function getProvinces(region) {
  const page = await getParsed(region.path)
  const provinces = getProvincesList(page)
  //const provinces = getEntities(page, classed('ut'))
  region.provinces = provinces
}

async function getComunes(province) {
  const page = await getParsed(province.path)
  const comunes = getEntities(page, classed('ct'))
  province.comunes = comunes
}

//debug
/*
const p = await getParsed('/valle-d-aosta/')
const cc = getProvincesList(p)
//const p = await getParsed('/valle-d-aosta/')
//const cc = getEntities(p, classed('ct'))
console.log(cc)
process.exit()
*/
//

const page = await getParsed(path)
const regions = getEntities(page, classed('vm'))
await Promise.all(regions.map(getProvinces))
// The below may trigger Anti DOS protection...
//await Promise.all(regions.map(({ provinces }) => Promise.all(provinces.map(getComunes))))
// ... so we make it sequentially:
await (async () => {
  for (let region of regions) {
    for (let province of region.provinces) {
      await getComunes(province)
      for (let comune of province.comunes) {
        // Comunes have relative paths, so we change path to absolute
        // Without slash it redirects to the page with slash, so we add it
        comune.path = resolve(province.path, comune.path) + '/'
        await getCap(comune)
      }
    }
  }
})()

// Fix names in upper case only
;(() => {
  const fixName = name => name
    .split(' ')
    .map(name => name[0] + name.slice(1).toLowerCase())
    .join(' ')

  const fix = comune => {
    const name = comune.name
    if (name == name.toUpperCase()) {
      const fixed = fixName(name)
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
