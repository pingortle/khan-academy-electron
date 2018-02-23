Array.prototype.rotate = function () {
  const item = this.shift()
  this.push(item)

  return item
}
