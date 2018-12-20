[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![devDependencies Status](https://david-dm.org/paulsutherland/polyonic-secure-pouch/dev-status.svg)](https://david-dm.org/paulsutherland/polyonic-secure-pouch?type=dev)
[![GitHub version](https://badge.fury.io/gh/paulsutherland/polyonic-secure-pouch.svg)](https://badge.fury.io/gh/paulsutherland%2Fpolyonic-secure-pouch)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

# polyonic-secure-pouch

PouchDB plugin for AES encryption of data in [Polyonic] and browsers using [danang-id/simple-crypto-js] which uses [brix/crypto-js]

```js
const db = new PouchDB('app.db');

db.encrypt(password);
// all done, docs should be transparently encrypted/decrypted
```

## Details

If you replicate to another database, it will decrypt before sending it to the external one. So make sure that one also has a password set as well if you want it encrypted too.

If you need to decrypt manually see [danang-id/simple-crypto-js]

This only encrypts the contents of documents, **not the `_id`, `_rev` or `_deleted`**.
I based this plugin on [lil5/simple-cryptor-pouch], but tailored it to work with the [Polyonic] app seed project.

This project should also work on the following:
* web (with a babel.js bundler)
* electron
* nodejs
* react native

> [Save attachments](https://pouchdb.com/api.html#save_attachment) are not ignored by default (`_attachments`), I would first need to make some test to really see if this is sane. At the moment I do not use attachments.  I prefer to store attachments/blobs in blob storage.

## Install

This plugin is hosted on npm:

```bash
npm i -s polyonic-secure-pouch
```

## API


### db.encrypt(password [, options])

Set up encryption on the database.

- `options.ignore`  
String or Array of Strings of properties that will not be encrypted.

## Examples

### Change password

```js
const PouchDB = require('pouchdb')
const encrypt = require('polyonic-secure-pouch')
PouchDB.plugin(encrypt)

const oldDBpath = './password-old.db'
const newDBpath = './password-new.db'

const oldDB = PouchDB(oldDBpath)
const newDB = PouchDB(newDBpath)

oldDB.encrypt('oldPassword')
newDB.encrypt('newBe//erPassw0rd')

PouchDB.replicate(oldDB, newDB, {live: true, retry: true})
.on('complete', info => console.log({output: info, message: 'complete'}))
.on('error', err => console.error(Error({output: err, message: 'error'})))
.on('denied', err => console.error(Error({output: err, message: 'denied'})))

```

file: [examples/change-password.js](https://github.com/paulsutherland/polyonic-secure-pouch/blob/master/examples/change-password.js)

### Sync encrypted remote

```js
const PouchDB = require('pouchdb')
const encrypt = require('polyonic-secure-pouch')
PouchDB.plugin(encrypt)

const localPath = './sync-remote.db'
const remoteURL = 'http://127.0.0.1:5984'

const local = PouchDB(localPath)
const remote = PouchDB(remoteURL)

remote.encrypt('password')

// comment out to encrypt only the remote
// local.encrypt('password')

PouchDB.sync(local, remote, {live: true, retry: true})
.on('complete', info => console.log({output: info, message: 'complete'}))
.on('error', err => console.error(Error({output: err, message: 'error'})))
.on('denied', err => console.error(Error({output: err, message: 'denied'})))

```
file: [examples/sync-encrypted-remote.js](https://github.com/paulsutherland/polyonic-secure-pouch/blob/master/examples/sync-encrypted-remote.js)

[Polyonic]: https://github.com/paulsutherland/Polyonic
[lil5/simple-cryptor-pouch]: https://github.com/lil5/simple-cryptor-pouch
[danang-id/simple-crypto-js]: https://github.com/danang-id/simple-crypto-js
[brix/crypto-js]: https://github.com/brix/crypto-js
