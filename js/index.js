const { mount } = require('redom')
const App = require('./components/app')
const api = require('./api')

const app = new App()

api(app)

mount(document.body, app)
