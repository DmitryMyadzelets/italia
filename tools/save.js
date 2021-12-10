const { writeFile } = require("fs/promises")

const save = (fname, obj) => writeFile(fname, JSON.stringify(obj, null, 2))

module.exports = save
