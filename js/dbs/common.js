'use strict'

const PouchDB = require('pouchdb')

const commonWordsDb = new PouchDB('words')
module.exports = commonWordsDb
