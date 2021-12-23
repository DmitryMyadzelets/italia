// Create shortcuts

const comunesInProvince = province => province.comunes
const toComunes = (arr, province) => arr.push(...comunesInProvince(province)) && arr
const comunesInRegion = region => region.provinces.reduce(toComunes, [])

const link = regions => regions.forEach(region => region.comunes = comunesInRegion(region))

export default link
