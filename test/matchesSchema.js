import Ajv from 'ajv'
//import addFormats from 'ajv-formats'

const string = s => JSON.stringify(s, null, '  ')
// Returns a message that you should fix the thing
const fixit = (thing, errors) => {
  return `This thing: ${string(thing)}\nhas errors: ${string(errors)}`
}

// Returns true if the thing matches the schema.
// Throws an error otherwise.
export default schema => {
  const ajv = new Ajv()
  //addFormats(ajv)
  const valid = ajv.compile(schema)
  return thing => {
    if (valid(thing)) {
      return true
    }
    throw new Error(fixit(thing, valid.errors))
  }
}
