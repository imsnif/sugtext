'use strict'

const test = require('tape')
const fs = require('fs')
const { promisify } = require('util')
const looksSame = promisify(require('looks-same'))

const { loadExtension } = require('../utils')

const screenshotDir = `${__dirname}/../screenshots`

test('textarea - suggest completions', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-completions.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggest completions in the middle of a text field', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('foo thi bar')
    for (let i = 0; i < 4; i++) {
      await textboxEl.press('ArrowLeft')
    }
    await textboxEl.type('a', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-completions-middle.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - complete word when pressing TAB', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thia', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-complete-first-word.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - complete word when pressing TAB in the middle of a text field', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('foo thi bar')
    for (let i = 0; i < 4; i++) {
      await textboxEl.press('ArrowLeft', {delay: 100})
    }
    await textboxEl.type('a', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-complete-first-word-middle.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - space causes suggestion box to disappear', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi ', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-space-disappears.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - combinations cause box to disappear', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    await contentPage.keyboard.down('Control', {delay: 100})
    await textboxEl.press('a', {delay: 100})
    await contentPage.keyboard.up('Control', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-combination.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - ESC removes box', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    await textboxEl.press('Escape', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-esc.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggest completions at the beginning of a text field with multiple lines', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('foo thi bar', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-completions-multiline-beginning.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggest completions in the middle of a text field with multiple lines', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
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
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-completions-multiline.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - complete word when pressing TAB in the middle of a text field with multiple lines', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
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
    const truth = fs.readFileSync(`${screenshotDir}/textarea-complete-first-word-multiline.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggestion box respects horizontal screen border', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    await contentPage.setViewport({width: 200, height: 500})
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('I am some text that will overflow thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-overflow-horizontal.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggestion box respects vertical screen border', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field')
    await contentPage.setViewport({width: 200, height: 200})
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 11; i++) {
      await textboxEl.press('Enter')
    }
    await textboxEl.type('th', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-overflow-vertical.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggest completions when scrolled down', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field-vert-scroll')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-completions-vert-scroll.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggest completions when scrolled right', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-textarea-field-horiz-scroll')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-completions-horiz-scroll.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - prefer new words (previously failed to complete) when suggestion completions', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thiafoobarbazilicious', {delay: 100})
    await textboxEl.press(' ', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-prefer-new-words.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - trim punctuation at end of previously failed to complete words', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thiafoobarbazilicious,', {delay: 100})
    await textboxEl.press(' ', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-prefer-new-words-trimmed.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - suggestions are case insensitive (always lowercase)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('tHia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-suggest-case-insensitive.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - new inserted words are case insensitive (always lowercase)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('Thiafoobarbazilicious,', {delay: 100})
    await textboxEl.press(' ', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-new-words-case-insensitive.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('textarea - completions are case sensitive (respect existing capital letters)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('tHia', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/textarea-complete-case-sensitive.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})
