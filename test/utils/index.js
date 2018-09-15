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
  async loadExtension (fixture, opts) {
    // TODO: CONTINUE HERE - add a cleanup method that would for the time being
    // delete all the documents in userWrodsDb (just like we do now in
    // init-dbs.js) then remove it from init-dbs.js
    // then try using the same instance of backgroundPage and contentPage like
    // we do with 'browser'
    console.time('setup')
    console.time('browser')
    browser = browser || await puppeteer.launch({args: ['--no-sandbox']})
    // browser = await puppeteer.launch({args: ['--no-sandbox']})
    console.timeEnd('browser')
    console.time('start pages')
    const context = await browser.createIncognitoBrowserContext()
    // const backgroundPage = await browser.newPage()
    const backgroundPage = await context.newPage()
    // const contentPage = await browser.newPage()
    const contentPage = await context.newPage()
    if (opts && opts.viewport) {
      await contentPage.setViewport({width: 200, height: 500})
    }
    console.timeEnd('start pages')
    backgroundPage.on('console', msg => console.log('BACKGROUND-PAGE LOG:', msg.text()))
    backgroundPage.on('pageerror', err => console.error('BACKGROUND-PAGE ERROR:', err.toString()))
    console.time('goto')
    // await backgroundPage.goto(`https://example.com`)
    await backgroundPage.goto(`file://${__dirname}/../fixtures/${fixture}/index.html`)
    console.timeEnd('goto')
    contentPage.on('console', msg => console.log('CONTENT-PAGE LOG:', msg.text()))
    contentPage.on('pageerror', err => console.error('CONTENT-PAGE ERROR:', err.toString()))
    console.time('misc stuff')
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
    console.timeEnd('misc stuff')
    console.time('bundles')
    backgroundBundle = backgroundBundle || await bundle(`${__dirname}/../../js/background.js`)
    contentBundle = contentBundle || await bundle(`${__dirname}/../../js/index.js`)
    console.timeEnd('bundles')
    console.time('scriptTag background')
    await backgroundPage.addScriptTag({content: backgroundBundle})
    console.timeEnd('scriptTag background')
    console.time('scriptTag content')
    await contentPage.addScriptTag({content: contentBundle})
    console.timeEnd('scriptTag content')
    console.timeEnd('setup')
    return { browser, backgroundPage, contentPage }
  }
}
