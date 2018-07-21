'use strict'

const { el, text } = require('redom')

const className = '.sugtext-instructions'

const style = {
  backgroundColor: '#3d3f40',
  color: '#dfff00',
  fontSize: '0.4em',
  fontWeight: 'bold',
  textRendering: 'optimizeLegibility',
  visibility: 'inherit'
}

const instructionText = '<TAB> / <UP> / <DOWN>'

module.exports = {
  InstructionLine () {
    return el(className, text(instructionText), {style})
  }
}
