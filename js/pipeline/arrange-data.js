const { path } = require('ramda')

const { tryCatchify } = require('./wrapper')

module.exports = {
  getTextFromSelection: selection => tryCatchify(() => {
    const text = path(['anchorNode', 'textContent'], selection)
    if (typeof text === 'undefined') {
      throw new Error('no textContent in selection')
    } else {
      return text
    }
  }),
  getPosFromSelection: selection => tryCatchify(() => { // TODO: move elsewhere, this is not io
    if (!selection) {
      throw new Error('no selection to get cursor position from')
    } else {
      const { anchorOffset } = selection
      return {start: anchorOffset, end: anchorOffset}
    }
  })
}
