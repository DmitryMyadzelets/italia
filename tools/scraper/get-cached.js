import { readFile, writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import get from './get.js'

const save = (fname, data) => writeFile(fname, data)
const load = fname => readFile(fname, { encoding: 'utf8' })

// Delay agains Denial of Service Protection
const wait= ms => {
  if (ms == undefined) {
    ms = 1000 + 5000 * Math.random() | 0
  }
  return new Promise(resolve => setTimeout(resolve, ms))
}

const cached = config => async (host, path = '') => {
  const { dir, debug, tout } = config

  // We encode entire url as a file name - no directories
  const fname = resolve(dir, './' + encodeURIComponent(host + path))
  let data

  // load || (get && save)
  try {
    data = await load(fname)
    debug && console.log('from cache', fname)
  } catch (ignore) {
    tout && await wait ()
    data = await get(host, path)
    debug && console.log('fetched')
    try {
      await save(fname, data)
      debug && console.log('to cache', fname)
    } catch (err) {
      console.error(err)
    }
  }
  return data
}

export default cached 
