'use strict'

const test = require('tape')

const { getBrowser } = require('../utils')

test.onFinish(async () => {
  const browser = getBrowser()
  await browser.close()
})
