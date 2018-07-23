'use strict'

const commonEnglishWords = require('../common-words.json')
const PouchDB = require('pouchdb')

const commonWordsDb = new PouchDB('words')
const userWordsDb = new PouchDB('userWords')

function initDbs () {
  const wordDocs = commonEnglishWords.map((w, i) => {
    return {_id: w, score: commonEnglishWords.length - i}
  })
  return commonWordsDb.bulkDocs(wordDocs)
}
initDbs()

browser.runtime.onMessage.addListener(msg => {
  const { appId, searchterm, newWord } = msg
  if (searchterm && searchterm.length > 1) {
    generateSuggestions(searchterm, appId)
  }
  if (newWord && newWord.length > 1) {
    addUserWord(newWord)
  }
})

async function getExistingWord (word) {
  try {
    const existing = await userWordsDb.get(word)
    return existing
  } catch (e) {
    if (e.status === 404) {
      return {}
    }
  }
}

async function addUserWord (newWord) {
  const trimmedWord = newWord.replace(/[,|.|!|\?]+$/, '')
  const existing = await getExistingWord(trimmedWord)
  const updated = {_id: trimmedWord, score: (existing.score || 0) + 1}
  await userWordsDb.put(Object.assign({}, existing, updated))
}

async function generateSuggestions (searchterm, appId) {
  const tabs = await browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
  const tabId = tabs[0].id
  const suggestions = await findWords(searchterm)
  if (suggestions.length > 0) {
    browser.tabs.sendMessage(tabId, {appId, suggestions})
  }
}

async function queryForWords (db, searchterm) {
  const matches = await db.allDocs({
    startkey: searchterm,
    endkey: `${searchterm}\uffff`,
    include_docs: true
  })
  return matches.rows
  .filter(m => m.id.length >= (searchterm.length + 2))
  .sort((a, b) => a.doc.score < b.doc.score)
  .slice(0, 5).map(m => m.id)
}

async function findWords (searchterm) {
  const userWordsResults = await queryForWords(userWordsDb, searchterm)
  if (userWordsResults.length === 5) {
    return userWordsResults
  } else {
    const commonWordsResults = await queryForWords(commonWordsDb, searchterm)
    return Array.from(
      new Set(userWordsResults.concat(commonWordsResults))
    ).slice(0, 5)
  }
}
