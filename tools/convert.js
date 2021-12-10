const path = require("path")
const csvtojson = require("csvtojson")
const save = require("./save")

const config = {
  src: "../csv/data.csv",
  dst: "../json/data.json",
}

const options = {
  delimiter: ";",
  trim: true
}

;(async () => {
  const src = path.resolve(__dirname, config.src)
  const dst = path.resolve(__dirname, config.dst)

  const array = await csvtojson(options).fromFile(src)

  await save(dst, array)

  console.log('Done! Data saved to '+ dst)
})()  
