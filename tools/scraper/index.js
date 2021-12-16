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
        const a = el.select('a')
        if (!a.empty()) { el = a }
        let strong = el.select('strong')
        if (!strong.empty()) { el = strong }
        switch (i) {
          case 0:
            name = el.html()
            break
          case 1:
            path = a.attr('href')
            codes = el.html()
            break
        }
      })
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
  //await Promise.all(provinces.map(getProvince))
}

const regions = await getCodes(path)
await Promise.all(regions.map(getProvinces))
await Promise.all(regions.map(({ provinces }) => Promise.all(provinces.map(getComunes))))

const noPath = o => delete o.path
regions.forEach(region => {
  noPath(region)
  region.provinces.forEach(province => {
    noPath(province)
    province.comunes.forEach(noPath)
  })
})

console.log(JSON.stringify(regions, null, 2))
