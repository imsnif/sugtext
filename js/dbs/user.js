'use strict'

const PouchDB = require('pouchdb')

const userWordsDb = new PouchDB('userWords')
module.exports = userWordsDb
