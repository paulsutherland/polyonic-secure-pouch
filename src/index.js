const SimpleCryptoJS = require('simple-crypto-js').default
const transform = require('transform-pouch').transform

const secure = require('./secure')

/**
* Pouch plugin function to encrypt and decrypt a doc entering and exiting the Database
* @param  {string} password
* @param  {Object} [options={}]
* @return {Object | Promise}
*/
function encrypt (password, options = {}) {
  const db = this

  // set default ignore
  options.ignore = ['_id', '_rev', '_deleted', '--encrypted--', '_conflicts'].concat(options.ignore)

  const simpleCryptoJS = new SimpleCryptoJS(password)

  db.transform({
    incoming: function (doc) {
      return secure.encrypt(simpleCryptoJS, doc, options.ignore)
    },
    outgoing: function (doc) {
      return secure.decrypt(simpleCryptoJS, doc, options.ignore)
    }
  })
}

module.exports = {
  transform,
  encrypt
}
