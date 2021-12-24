import { writeFile } from 'fs/promises'

const save = (fname, obj) => writeFile(fname, JSON.stringify(obj, null, 2))

export default save
