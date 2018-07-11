'use strict'

const test = require('tape')
const fs = require('fs')
const { promisify } = require('util')
const looksSame = promisify(require('looks-same'))

const { loadExtension } = require('../utils')

const screenshotDir = `${__dirname}/../screenshots`

test('contentEditable - suggest completions', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions.png`)
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
    await textboxEl.type('thi', {delay: 100})
    await textboxEl.press('ArrowDown', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-movedown.png`)
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
    await textboxEl.type('thi', {delay: 100})
    await textboxEl.press('ArrowDown', {delay: 100})
    await textboxEl.press('ArrowUp', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-moveup.png`)
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
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('foo thi bar')
    for (let i = 0; i < 4; i++) {
      await textboxEl.press('ArrowLeft')
    }
    await textboxEl.type('a', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-middle.png`)
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
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thia', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-complete-first-word.png`)
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
    await textboxEl.type('thia', {delay: 100})
    await textboxEl.press('ArrowDown', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-complete-second-word.png`)
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
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('foo thi bar')
    for (let i = 0; i < 4; i++) {
      await textboxEl.press('ArrowLeft', {delay: 100})
    }
    await textboxEl.type('a', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-complete-first-word-middle.png`)
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
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi ', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-space-disappears.png`)
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
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    await contentPage.keyboard.down('Control', {delay: 100})
    await textboxEl.press('a', {delay: 100})
    await contentPage.keyboard.up('Control', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-combination.png`)
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
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    await textboxEl.press('Escape', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-esc.png`)
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
      await textboxEl.type('foo thi bar', {delay: 100})
      await textboxEl.press('Enter', {delay: 100})
    }
    await textboxEl.press('ArrowUp', {delay: 100})
    for (let i = 0; i < 5; i++) {
      await textboxEl.press('ArrowLeft', {delay: 100})
    }
    await textboxEl.type('a', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-multiline.png`)
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
      await textboxEl.type('foo thi bar', {delay: 100})
      await textboxEl.press('Enter', {delay: 100})
    }
    await textboxEl.press('ArrowUp', {delay: 100})
    for (let i = 0; i < 5; i++) {
      await textboxEl.press('ArrowLeft', {delay: 100})
    }
    await textboxEl.type('a', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-complete-first-word-multiline.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggestion box respects horizontal screen border', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.setViewport({width: 200, height: 500})
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('I am some text that will overflow thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-overflow-horizontal.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggestion box respects vertical screen border (with inverse selection)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.setViewport({width: 200, height: 200})
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 5; i++) {
      await textboxEl.press('Enter')
    }
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-overflow-vertical.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions when scrolled down', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field-vert-scroll')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-vert-scroll.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions when scrolled right', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field-horiz-scroll')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-horiz-scroll.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})
