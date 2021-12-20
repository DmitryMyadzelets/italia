import { request } from 'https'
// The 'node-html-parser' has limited capabilites, not all d3 methods would work

function get (host, path) {
  return new Promise((resolve, reject) => {
    request({
      host: host,
      path: path
      //headers: { 'Content-Type': 'application/json' }
    }, res => {
      let data = ''

      if (res.statusCode !== 200) {
        const msg = 'http status code is ' + res.statusCode + ' for ' + host + path
        reject(new Error(msg))
      }

      res
        .on('data', chunk => data += chunk)
        .on('end', () => resolve(data))

    }).end()
  })
}

export default get
