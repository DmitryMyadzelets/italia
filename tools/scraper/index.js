import { select } from 'd3-selection'
import { parse } from 'node-html-parser'
import get from './get.js'
import config from './.config.js'
const { host, path } = config

// All pages we need on the host are formatted almost the same way.
// We use one function to parse it
async function getCodes(path) {
  let page = await get(host, path)
  page = parse(page)
  const data = []

  const tr = select(page)
    .select('tbody')
    .selectAll('tr')
    .filter(function () { return select(this).selectAll('td').size() == 2})

  tr.each(function () {
    let name, codes, path, a
    select(this)
      .selectAll('td')
      .each(function (ignore, i) {
        let el = select(this)
        let a = el.select('a')
        if (!a.empty()) {
          el = a
        }
        switch (i) {
          case 0:
            name = el.html()
            break
          case 1:
            path = a.attr('href')
            codes = a.html()
            break
        }
      })
    data.push({ name, codes, path })
  })

  return data
}

const regions = await getCodes(path)

await Promise.all(regions.map(async region => {
  const provinces = await getCodes(region.path)
  region.provinces =  provinces
  delete region.path

  await Promise.all(provinces.map(async province => {
    const comunes = await getCodes(province.path)
    comunes.forEach(comune => delete comune.path)
    province.comunes = comunes
    delete province.path
  }))
}))

console.log(JSON.stringify(regions, null, 2))
