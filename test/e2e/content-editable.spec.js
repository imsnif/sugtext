'use strict'

const test = require('tape')
const fs = require('fs')
const { promisify } = require('util')
const looksSame = promisify(require('looks-same'))

const { getBrowser, loadExtension } = require('../utils')

const screenshotDir = `${__dirname}/../screenshots`

test.onFinish(async () => {
  const browser = getBrowser()
  await browser.close()
})

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
    // await browser.close()
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
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - complete word when pressing TAB', async t => {
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
    // await browser.close()
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
    // await browser.close()
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
    // await browser.close()
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
    // await browser.close()
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
    // await browser.close()
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
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - complete first word when pressing TAB in the middle of a text field with multiple lines', async t => {
  t.plan(1)
  try {
    const { browser, contentPage, backgroundPage } = await loadExtension('one-contenteditable-field')
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
    await contentPage.close()
    await backgroundPage.close()
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggestion box respects horizontal screen border', async t => {
  t.plan(1)
  try {
    const viewport = {width: 200, height: 500}
    const { browser, contentPage } = await loadExtension(
      'one-contenteditable-field',
      {viewport}
    )
    // await contentPage.setViewport({width: 200, height: 500})
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('I am some text that will overflow thia', {delay: 100})
    const captured = await contentPage.screenshot()
    fs.writeFileSync('/tmp/captured.png', captured)
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-overflow-horizontal.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggestion box respects vertical screen border', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    await contentPage.setViewport({width: 200, height: 200})
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 9; i++) {
      await textboxEl.press('Enter')
    }
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-overflow-vertical.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
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
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions when scrolled down inside field', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field-overflow-down')
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 15; i++) {
      await textboxEl.press('Enter')
    }
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-overflow-down.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions when scrolled down in both page and field', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field-vert-scroll-overflow')
    const textboxEl = await contentPage.$('#completeme')
    for (let i = 0; i < 15; i++) {
      await textboxEl.press('Enter')
    }
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-vert-scroll-overflow.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
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
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - prefer new words (previously failed to complete) when suggestion completions', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thiafoobarbazilicious', {delay: 100})
    await textboxEl.press(' ', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-prefer-new-words.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - trim punctuation at end of previously failed to complete words', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thiafoobarbazilicious,', {delay: 100})
    await textboxEl.press(' ', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-prefer-new-words-trimmed.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggestions are case insensitive (always lowercase)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('tHia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-case-insensitive.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - new inserted words are case insensitive (always lowercase)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('Thiafoobarbazilicious,', {delay: 100})
    await textboxEl.press(' ', {delay: 100})
    await textboxEl.press('Enter', {delay: 100})
    await textboxEl.type('thia', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-new-words-case-insensitive.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - completions are case sensitive (respect existing capital letters)', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('tHia', {delay: 100})
    await textboxEl.press('Tab', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-complete-case-sensitive.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})

test('contentEditable - suggest completions above zIndex', async t => {
  t.plan(1)
  try {
    const { browser, contentPage } = await loadExtension('one-contenteditable-field-zIndex')
    const textboxEl = await contentPage.$('#completeme')
    await textboxEl.type('thi', {delay: 100})
    const captured = await contentPage.screenshot()
    const truth = fs.readFileSync(`${screenshotDir}/contenteditable-suggest-completions-zIndex.png`)
    const matchesScreenshot = await looksSame(truth, captured)
    t.ok(matchesScreenshot, 'captured screenshot matches saved screenshot')
    // await browser.close()
  } catch (e) {
    t.fail(e.message)
  }
})
