const toArray = f => (arr, o) => arr.push(...f(o)) && arr
const comunesInProvince = province => province.comunes
const comunesInRegion = region => region.provinces.reduce(toArray(comunesInProvince), [])
const getComunes = regions => regions.reduce(toArray(comunesInRegion), [])

// Returns true if the number v is in the range [a, b]
const inRange = (v, [a, b]) => b ? b >= v && v >= a : v === a

const lookup = regions => {
  const comunes = getComunes(regions)

  // Make a map: postcode => [ comunes ]
  const map = comunes.reduce((o, comune) => {
    // Take the lower codes as a key
    const key = comune.codes[0]
    o[key] ? o[key].push(comune) : o[key] = [ comune ]
    return o
  }, {})

  // Make lookup table
  // In table we replace the key with original array of codes from the first comune
  const table = Object.entries(map)
  table.forEach(arr => arr[0] = arr[1][0].codes)
  table.sort((a, b) => a[0][0] - b[0][0])

  // Returns an array of comunes with given poscode, or undefined
  const comunesBy = code => (table.find(([codes]) => inRange(code, codes)) || [])[1]

  return comunesBy
}

export default lookup
