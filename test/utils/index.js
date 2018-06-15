'use strict'

const puppeteer = require('puppeteer')
const browserify = require('browserify')

function bundle (path) {
  return new Promise((resolve, reject) => {
    let data = ''
    const stream = browserify(path).bundle()
    stream.on('data', d => {
      data += d
    })
    stream.on('end', () => resolve(data))
    stream.on('error', reject)
  })
}

module.exports = {
  async loadExtension (fixture) {
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const backgroundPage = await browser.newPage()
    const contentPage = await browser.newPage()
    backgroundPage.on('console', msg => console.log('BACKGROUND-PAGE LOG:', msg.text()))
    backgroundPage.on('pageerror', err => console.error('BACKGROUND-PAGE ERROR:', err.toString()))
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
    const backgroundBundle = await bundle(`${__dirname}/../../js/background.js`)
    const contentBundle = await bundle(`${__dirname}/../../js/index.js`)
    await backgroundPage.addScriptTag({content: backgroundBundle})
    await contentPage.addScriptTag({content: contentBundle})
    return { browser, backgroundPage, contentPage }
  }
}
