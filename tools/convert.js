import path from 'path'
import csvtojson from 'csvtojson'
import save from './save.js'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  src: '../csv/data.csv',
  dst: '../json/data.json',
}

const options = {
  delimiter: ';',
  trim: true
}

;(async () => {
  const src = path.resolve(dirname, config.src)
  const dst = path.resolve(dirname, config.dst)

  const array = await csvtojson(options).fromFile(src)

  await save(dst, array)
  console.log(`Saved ${ dst }`)
})()  
