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

test('contentEditable - complete first words when pressing TAB', async t => {
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

