//import { select } from 'd3-selection'
// import { parse, valid } from 'node-html-parser'
import { parseDocument as parse } from 'htmlparser2'
import { getElementsByTagName as select, textContent } from 'domutils'
import get from './get.js'
import config from './.config.js'
const { host, path } = config


// Helper
// Traverse all children till no tags left. Returns the last element
const skipTags = e => {
  const tag = e.children.find(e => e.type == 'tag')
  return tag ? skipTags(tag) : e
}

// Helper
// Returns true if the element has given class
const classed = className => e => e.attribs.class.includes(className)

// All pages we need on the host are formatted almost the same way.
// We use one function to parse it
async function getCodes(path) {
  const data = []

  let page = await get(host, path)
  page = parse(page)

  const tables = select('table', page).filter(classed('table-bordered'))

  select('tr', select('tbody', tables))
    .map(tr => select('td', tr))
    .filter(tds => tds.length == 2)
    .forEach(tds => {
      const name = textContent(skipTags(tds[0]))
      const codes = textContent(skipTags(tds[1]))
      const path = select('a', tds[1]).map(a => a.attribs.href)[0]
      data.push({ name, codes, path })
    })

  return data
}

async function getComunes(province) {
  const comunes = await getCodes(province.path)
  province.comunes = comunes
}

async function getProvinces(region) {
  const provinces = await getCodes(region.path)
  region.provinces =  provinces
}

const regions = await getCodes(path)
await Promise.all(regions.map(getProvinces))
await Promise.all(regions.map(({ provinces }) => Promise.all(provinces.map(getComunes))))

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
