const reduce = require('lodash.reduce')

module.exports = {

  encrypt (crypto, doc, ignore) {
    if (doc['--encrypted--']) { return doc }

    const result = reduce(doc, (result, value, key) => {
      if (ignore.indexOf(key) !== -1) {
        result[key] = value
      } else {
        result['encrypted_' + key] = crypto.encrypt(JSON.stringify(doc[key]))
      }
      return result
    }, {})
    result['--encrypted--'] = true
    return result
  },

  decrypt (crypto, doc, ignore) {
    if (!doc['--encrypted--']) { return doc }

    const result = reduce(doc, (result, value, key) => {
      if (ignore.indexOf(key) !== -1) {
        result[key] = value
      } else {
        result[key.slice(10)] = JSON.parse(JSON.stringify(crypto.decrypt(doc[key])))
      }
      return result
    }, {})
    delete result['--encrypted--']
    return result
  }
}
