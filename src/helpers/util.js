let padLeft = (n, padChar) => {
  return n < 10 ? padChar + n : n
}

let getCurrDateTime = () => {
  let d = new Date()
  return d.getFullYear() + '-' + padLeft(d.getMonth(), '0') + '-' + padLeft(d.getDay(), '0') + ' ' +
    d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
}

export {
  getCurrDateTime
}
