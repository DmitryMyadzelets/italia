import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
// ES6 can't import JSON, we have to load it
import load from '../tools/load.js'
import matchesSchema from './matchesSchema.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const schema = fname => resolve(currentDir, './schemas/', fname)

const schemas = {
  region: await load(schema('region.json')),
  province: await load(schema('province.json')),
  commune: await load(schema('commune.json'))
}

const validate = {
  region: matchesSchema(schemas.region),
  province: matchesSchema(schemas.province),
  commune: matchesSchema(schemas.commune)
}

export default validate
