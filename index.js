const requireDir = require('require-dir')
const path = require('path')
const fs = require('fs')
const blacklist = fs.readFileSync(path.join(__dirname, 'blacklist.txt'), 'utf8').split('\n')
const counts = require('download-counts')
const dependentCounts = require('dependent-counts')
const packages = Object.values(requireDir('./packages'), {recurse: true})
  .filter(pkg => !blacklist.includes(pkg.name))
  .map(pkg => Object.assign(pkg, {averageDailyDownloads: counts[pkg.name] || 0}))
  .map(pkg => Object.assign(pkg, {
    dependentCounts: (dependentCounts.find(dep => dep.name === pkg.name) || {totalDirectDependents: 0})
  }))
  .sort((a, b) => b.averageDailyDownloads - a.averageDailyDownloads)

module.exports = packages