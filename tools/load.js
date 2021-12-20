import { readFile } from 'fs/promises'

const load = fname => readFile(fname, { encoding: 'utf8' }).then(JSON.parse)

export default load
