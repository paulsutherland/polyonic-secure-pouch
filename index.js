const SimpleCryptoJS = require('simple-crypto-js').default
const transform = require('transform-pouch').transform

const crypto = require('./crypto')

/**
* Pouch plugin function to encrypt and decrypt a doc entering and exiting the Database
* @param  {string} password
* @param  {Object} [options={}]
* @return {Object | Promise}
*/
function encrypt (password, options = {}) {
  const db = this

  // set default ignore
  options.ignore = ['_id', '_rev', '_deleted', '--encrypted--'].concat(options.ignore)

  const simpleCryptoJS = new SimpleCryptoJS(password)

  db.transform({
    incoming: function (doc) {
      return crypto.encrypt(simpleCryptoJS, doc, options.ignore)
    },
    outgoing: function (doc) {
      return crypto.decrypt(simpleCryptoJS, doc, options.ignore)
    }
  })
}

module.exports = {
  transform,
  encrypt
}
