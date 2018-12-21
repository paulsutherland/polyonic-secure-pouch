const SimpleCryptoJS = require('simple-crypto-js').default
const test = require('ava')
const secure = require('../src/secure')

const ignore = ['_id', '_rev', '_deleted', '--encrypted--']

test('secure', t => {
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

  const encrypted = secure.encrypt(inCrypto, doc, ignore)
  t.log(JSON.stringify(encrypted))
  const decrypted = secure.decrypt(outCrypto, encrypted, ignore)

  t.deepEqual(doc, decrypted, 'if secure pouch works for Array<object>')
})
