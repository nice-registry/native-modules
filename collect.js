const registry = require('package-stream')()
const path = require('path')
const fs = require('fs')
const spinner = require('ora')().start()
const checkPackage = require('./lib/check-package')
let count = 0

registry
  .on('package', function (pkg) {
    spinner.text = String(++count)
    if (checkPackage(pkg)) savePackage(pkg)
  })
  .on('up-to-date', function () {
    console.log('Done.')
    process.exit()
  })

  function savePackage (pkg) {
    const file = path.join(__dirname, `packages/${pkg.name.replace('/', '___')}.json`)
    fs.writeFileSync(file, JSON.stringify(pkg))
    console.log()
    console.log([pkg.name, pkg.description].join(' - '))
  }