'use strict'

const puppeteer = require('puppeteer')
const browserify = require('browserify')
const aliasify = require('aliasify')
const babelify = require('babelify')

function bundle (path) {
  return new Promise((resolve, reject) => {
    let data = ''
    const stream = browserify(path)
      .transform(babelify, {plugins: ['transform-async-to-generator']})
      .transform(aliasify, {aliases: {
        '../common-words.json': './test/fixtures/stub-words.json'
      }})
      .bundle()
    stream.on('data', d => {
      data += d
    })
    stream.on('end', () => resolve(data))
    stream.on('error', reject)
  })
}

let browser, backgroundBundle, contentBundle

module.exports = {
  getBrowser: () => browser,
  async loadExtension (fixture) {
    browser = browser || await puppeteer.launch({args: ['--no-sandbox']})
    const context = await browser.createIncognitoBrowserContext()
    const backgroundPage = await context.newPage()
    const contentPage = await context.newPage()
    backgroundPage.on('console', msg => console.log('BACKGROUND-PAGE LOG:', msg.text()))
    backgroundPage.on('pageerror', err => console.error('BACKGROUND-PAGE ERROR:', err.toString()))
    await backgroundPage.goto(`file://${__dirname}/../fixtures/${fixture}/index.html`)
    contentPage.on('console', msg => console.log('CONTENT-PAGE LOG:', msg.text()))
    contentPage.on('pageerror', err => console.error('CONTENT-PAGE ERROR:', err.toString()))
    await backgroundPage.addScriptTag({path: `${__dirname}/../mocks/stub-firefox-background.js`})
    await contentPage.goto(`file://${__dirname}/../fixtures/${fixture}/index.html`)
    await contentPage.addScriptTag({path: `${__dirname}/../mocks/stub-firefox-content.js`})
    await backgroundPage.exposeFunction('sendToContentPage', (...msg) => {
      contentPage.evaluate(msg => window.browser.listeners.forEach(func => func(msg)), msg[1])
    })
    await contentPage.exposeFunction('sendToBackgroundPage', (...msg) => {
      backgroundPage.evaluate((...msg) => window.browser.listeners.forEach(func => {
        func(...msg)
      }), ...msg)
    })
    backgroundBundle = backgroundBundle || await bundle(`${__dirname}/../../js/background.js`)
    contentBundle = contentBundle || await bundle(`${__dirname}/../../js/index.js`)
    await backgroundPage.addScriptTag({content: backgroundBundle})
    await contentPage.addScriptTag({content: contentBundle})
    return { browser, backgroundPage, contentPage }
  }
}
