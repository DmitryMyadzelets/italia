const { writeFile } = require("fs/promises")

const options = {
  encoding: "utf8"
}

const save = (fname, obj) => writeFile(fname, JSON.stringify(obj, null, 2), options)

module.exports = save
