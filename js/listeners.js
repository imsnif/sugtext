const { dispatch } = require('./dispatch')
const { position, offset } = require('caret-pos')
const { sendToBackground } = require('./msg-bus')

function resetCursorPosition (el, position) {
  const range = document.createRange()
  const sel = window.getSelection()
  range.setStart(el, position)
  sel.removeAllRanges()
  sel.addRange(range)
}

function insertSuggestion ({searchterm, suggestion, pos, initialText}) {
  const wordStartPosition = searchterm
    ? pos - searchterm.length
    : pos
  const textBeforeSearchterm = initialText.slice(0, wordStartPosition)
  const textAfterSearchterm = initialText.slice(wordStartPosition + searchterm.length)
  const contentWithCompletedWord = `${textBeforeSearchterm}${suggestion}`
  const text = `${contentWithCompletedWord}${textAfterSearchterm}`
  const cursorPosition = contentWithCompletedWord.length
  return {text, cursorPosition}
}

module.exports = (store, app) => {
  return {
    onKeyDown (e) {
      if (e.key === 'Tab') {
        if (store.get('visibility') !== 'visible') return
        const searchterm = store.get('searchterm')
        const suggestions = store.get('suggestions')
        const { word } = suggestions.find(s => s.selected)
        const selection = window.getSelection()
        const { anchorNode, anchorOffset } = selection
        const re = new RegExp(`${searchterm}$`)
        const { text, cursorPosition } = insertSuggestion({searchterm, suggestion: word, pos: anchorOffset, initialText: anchorNode.textContent})
        anchorNode.textContent = text
        resetCursorPosition(anchorNode, cursorPosition)
        e.preventDefault()
        this.focus()
        dispatch(app, 'visibility', 'hidden')
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (store.get('visibility') !== 'visible') return
        e.preventDefault()
        this.focus()
        dispatch(app, 'moveSelection', e.key)
      } else {
        dispatch(app, 'visibility', 'hidden')
      }
    },
    onBlur (e) {
      dispatch(app, 'visibility', 'hidden')
    },
    onKeypress (e) {
      if (/^[a-z0-9]$/i.test(e.key)) {
        const off = offset(this)
        const selection = window.getSelection()
        const { anchorNode, anchorOffset } = selection
        const searchterm = anchorNode.textContent.slice(0, anchorOffset).split(/\s+/).pop() + e.key
        dispatch(app, 'position', off)
        dispatch(app, 'search', searchterm)
        sendToBackground({searchterm})
      }
    },
    onMsgFromBackground ({suggestions}) {
      dispatch(app, 'visibility', 'visible')
      dispatch(app, 'suggest', suggestions)
    }
  }
}
