const requireDir = require('require-dir')
const path = require('path')
const fs = require('fs')
const blacklist = fs.readFileSync(path.join(__dirname, 'blacklist.txt'), 'utf8').split('\n')
const downloadCounts = require('download-counts')
const dependentCounts = require('dependent-counts')
const NicePackage = require('nice-package')
const packages = Object.values(requireDir('./packages'))
  .filter(pkg => !blacklist.includes(pkg.name))
  .map(pkg => {
    pkg = Object.assign(pkg, {
      averageDailyDownloads: getAverageDailyDownloads(pkg),
      dependentCounts: getDependentCounts(pkg)
    })
    return new NicePackage(pkg)
  })
  .sort((a, b) => b.averageDailyDownloads - a.averageDailyDownloads)

module.exports = packages

function getAverageDailyDownloads (pkg) {
  return downloadCounts[pkg.name] || 0
}

function getDependentCounts (pkg) {
  return dependentCounts.find(dep => dep.name === pkg.name) || {totalDirectDependents: 0}
}