const path = require("path")
const load = require("./load")
const save = require("./save")

const config = {
  src: path.resolve(__dirname, "../json/data.json"),
  dstRegions: path.resolve(__dirname, "../json/regions.json"),
  dstProvinces: path.resolve(__dirname, "../json/provinces.json"),
  dstItaly: path.resolve(__dirname, "../json/italy.json")
}

// The following methods give same results. Using Set is a little faster
// const unique = (v, i, a) => a.indexOf(v) == i
// const byKey = key => arr => arr.map(obj => obj[key]).filter(unique)
const byKey = key => arr => [... new Set(arr.map(obj => obj[key]))]

const regionKey = "Denominazione Regione"
const provinceKey = "Denominazione dell'Unità territoriale sovracomunale \n(valida a fini statistici)"
const comuneKey = "Denominazione in italiano"
const getRegions= byKey(regionKey)
const getProvinces = byKey(provinceKey)

async function saveAndLog(fname, data) {
  await save(fname, data)
  console.log(`Saved ${ fname }`)
}

const child = (parent, key) => parent[key] || (parent[key] = {})

const getItaly = data => data.reduce((italy, o) => {
  const region = o[regionKey]
  const province = o[provinceKey]
  const comune = o[comuneKey]

  child(child(child(italy, region), province), comune)

  return italy
}, {})

;(async () => {
  const data = await load(config.src)

  await saveAndLog(config.dstRegions, getRegions(data).sort())
  await saveAndLog(config.dstProvinces, getProvinces(data).sort())
  await saveAndLog(config.dstItaly, getItaly(data))
})()
