const { readFile } = require("fs/promises")

const load = fname => readFile(fname, { encoding: "utf8" }).then(JSON.parse)

module.exports = load
