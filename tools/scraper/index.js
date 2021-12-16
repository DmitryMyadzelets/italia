import { select } from 'd3-selection'
import { parse } from 'node-html-parser'
import get from './get.js'
// const save = require('./save')
import config from './.config.js'
const { host } = config

if (true) {
  const path = '/cap-regioni-italiane'

  let page = await get(host, path)
  page = parse(page)

  const tr = select(page)
    .select('tbody')
    .selectAll('tr')
    .filter(function () { return select(this).selectAll('td').size() == 2})

  tr.each(function () {
    let name, codes, path
    select(this)
      .selectAll('td')
      .each(function (ignore, i) {
        switch (i) {
          case 0:
            name = select(this).html()
            break
          case 1:
            const a = select(this).select('a')
            path = a.attr('href')
            codes = a.html()
            break
        }
      })
    console.log(name, codes, path)
  })
}
