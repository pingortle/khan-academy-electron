window.size = function (...params) {
  resizeCanvas(...params)
}

window.debug = function (...params) {
  console.log(...params)
}

window.PVector = function (x, y) {
  [this.x, this.y] = [x, y]
}
