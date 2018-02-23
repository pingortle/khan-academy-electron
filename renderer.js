// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const vm = require('vm')
const p5 = require('p5')
new p5() // force p5 to load globally

const canvas = createCanvas(0, 0)

require('./lib/shims/array/rotate')
require('./lib/shims/khan-academy')

const sketches = fs.readdirSync('./sketches')
const codes = sketches.map(
  (filename) => fs.readFileSync(`./sketches/${filename}`).toString('utf8')
)
const scripts = codes.map((code) => new vm.Script(code))

const scriptOptions = { filename: 'sketch', displayErrors: true }

const init = function () {
  canvas.parent('container')
  resizeCanvas(400, 400)
}
setup = init

function next() {
  setup = init
  scripts.rotate().runInThisContext(scriptOptions)
  setup()
}

const nextControl = document.getElementById('next')
nextControl.onclick = next

next()
