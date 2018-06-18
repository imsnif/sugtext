'use strict'

const test = require('tape')
const fs = require('fs')
const { promisify } = require('util')
const looksSame = promisify(require('looks-same'))

const { loadExtension } = require('./utils')

test('contentEditable - suggest completions', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'thi')
    await new Promise(resolve => setTimeout(resolve, 100)) // suggestions received in under 100ms
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-suggest-completions.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - can move down to next suggestion', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await contentPage.type('#completeme', 'thi', {delay: 100})
    await textboxEl.press('ArrowDown', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-suggest-completions-movedown.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - can move up to previous suggestion', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await contentPage.type('#completeme', 'thi', {delay: 100})
    await textboxEl.press('ArrowDown', {delay: 100})
    await textboxEl.press('ArrowUp', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-suggest-completions-moveup.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions in the middle of a text field', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'foo thi bar')
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 4; i++) {
      await textboxEl.press('ArrowLeft')
    }
    await contentPage.type('#completeme', 'a')
    await new Promise(resolve => setTimeout(resolve, 100)) // suggestions received in under 100ms
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-suggest-completions-middle.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - complete first word when pressing TAB', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'thia')
    await new Promise(resolve => setTimeout(resolve, 100)) // wait for suggestions up to 100ms
    await contentPage.keyboard.press('Tab')
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-complete-first-word.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - complete second first word when pressing down and then TAB', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await contentPage.type('#completeme', 'thia', {delay: 100})
    await textboxEl.press('ArrowDown', {delay: 100})
    await contentPage.keyboard.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-complete-second-word.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - complete first words when pressing TAB in the middle of a text field', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'foo thi bar')
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 4; i++) {
      await textboxEl.press('ArrowLeft', {delay: 100})
    }
    await contentPage.type('#completeme', 'a', {delay: 100})
    await contentPage.keyboard.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-complete-first-word-middle.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - space causes suggestion box to disappear', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'thi ', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-space-disappears.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - combinations cause box to disappear', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'thi', {delay: 100})
    const textboxEl = await contentPage.$('#completeme')
    await contentPage.keyboard.down('Control', {delay: 100})
    await textboxEl.press('a', {delay: 100})
    await contentPage.keyboard.up('Control', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-combination.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - ESC removes box', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.type('#completeme', 'thi', {delay: 100})
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.press('Escape', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-esc.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions in the middle of a text field with multiple lines', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 3; i++) {
      await contentPage.type('#completeme', 'foo thi bar')
      await textboxEl.press('Enter')
    }
    await textboxEl.press('ArrowUp')
    for (let i = 0; i < 5; i++) {
      await textboxEl.press('ArrowLeft')
    }
    await contentPage.type('#completeme', 'a', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-suggest-completions-multiline.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - complete first word when pressing TAB in the middle of a text field with multiple lines', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 3; i++) {
      await contentPage.type('#completeme', 'foo thi bar')
      await textboxEl.press('Enter')
    }
    await textboxEl.press('ArrowUp')
    for (let i = 0; i < 5; i++) {
      await textboxEl.press('ArrowLeft')
    }
    await contentPage.type('#completeme', 'a', {delay: 100})
    await contentPage.keyboard.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${__dirname}/screenshots/contenteditable-complete-first-word-multiline.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})
