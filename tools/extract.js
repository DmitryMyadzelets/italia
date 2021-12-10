const path = require("path")
const load = require("./load")
const save = require("./save")

const config = {
  src: path.resolve(__dirname, "../json/data.json"),
  dstRegions: path.resolve(__dirname, "../json/regions.json"),
  dstProvinces: path.resolve(__dirname, "../json/provinces.json") 
}

// The following methods give same results. Using Set is a little faster
// const unique = (v, i, a) => a.indexOf(v) == i
// const byKey = key => arr => arr.map(obj => obj[key]).filter(unique)
const byKey = key => arr => [... new Set(arr.map(obj => obj[key]))]

const getRegions= byKey("Denominazione Regione")
const getProvinces = byKey("Denominazione dell'Unità territoriale sovracomunale \n(valida a fini statistici)")
const getCodes = byKey("Sigla automobilistica")

async function saveAndLog(fname, data) {
  await save(fname, data)
  console.log(`Saved ${ fname }`)
}

;(async () => {
  const data = await load(config.src)

  await saveAndLog(config.dstRegions, getRegions(data).sort())
  await saveAndLog(config.dstProvinces, getProvinces(data).sort())
})()
