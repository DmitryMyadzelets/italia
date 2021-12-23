// Given regions, returns amount of regions, provinces and comunes

const stats = regions => ({
  total: {
    regions: Object.keys(regions).length,
    provinces: regions.reduce((sum, region) => sum + region.provinces.length, 0),
    comunes: regions.reduce((sum, region) => sum + region.comunes.length, 0)
  }
})

export default stats
