const SimpleCryptoJS = require('simple-crypto-js').default
const test = require('ava')
const crypto = require('../crypto')

const ignore = ['_id', '_rev', '_deleted', '--encrypted--']

test('crypto', t => {
  const password = 'password'
  const inCrypto = new SimpleCryptoJS(password)
  const outCrypto = new SimpleCryptoJS(password)

  let doc = {
    _id: 'thisid',
    one: [
      { text: 'hello' },
      { text: 'goodbye' }
    ],
    two: 2,
    three: 'hi',
    four: 3e4,
    five: [['one'], ['two'], ['three', 'four']]
  }

  const encrypted = crypto.encrypt(inCrypto, doc, ignore)
  t.log(JSON.stringify(encrypted))
  const decrypted = crypto.decrypt(outCrypto, encrypted, ignore)

  t.deepEqual(doc, decrypted, 'if cryptor works for Array<object>')
})
