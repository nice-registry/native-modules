const packages = require('.')
const fs = require('fs')
const path = require('path')
const tableify = require('tableify')
const dedent = require('dedent')
const {chain} = require('lodash')
const {snakeCase} = require('change-case')
const MAX = 50

function pkgLink(pkg) {
  return `<a href="http://ghub.io/${pkg.name}">${pkg.name}</a>`
}

let datasets = {
  'top dependents of `nan` by dependent count': {
    data: chain(packages)
      .filter(pkg => pkg.somehowDependsOn('nan'))
      .orderBy('dependentCounts.totalDirectDependents', 'desc')
      .slice(0, MAX)  
      .map(pkg => {
        return {
          name: pkgLink(pkg),
          description: pkg.description,
          dependents: pkg.dependentCounts.totalDirectDependents
        }
      })
      .value()
  },

  'top dependents of `nan` by daily download count': {
    data: chain(packages)
      .filter(pkg => pkg.somehowDependsOn('nan'))
      .orderBy('averageDailyDownloads', 'desc')
      .slice(0, MAX)  
      .map(pkg => {
        return {
          name: pkgLink(pkg),
          description: pkg.description,
          downloads: pkg.averageDailyDownloads
        }
      })
      .value()
  },

  'all dependents of `prebuild`': {
    data: chain(packages)
      .filter(pkg => pkg.somehowDependsOn('prebuild'))
      .orderBy('averageDailyDownloads', 'desc')
      .map(pkg => {
        return {
          name: pkgLink(pkg),
          description: pkg.description,
          downloads: pkg.averageDailyDownloads,
          dependents: pkg.dependentCounts.totalDirectDependents
        }
      })
      .value()
  },

  'all dependents of `prebuildify`': {
    data: chain(packages)
      .filter(pkg => pkg.somehowDependsOn('prebuildify'))
      .orderBy('averageDailyDownloads', 'desc')
      .map(pkg => {
        return {
          name: pkgLink(pkg),
          description: pkg.description,
          downloads: pkg.averageDailyDownloads,
          dependents: pkg.dependentCounts.totalDirectDependents
        }
      })
      .value()
  }
}

// Add slugs
Object.keys(datasets).forEach(title => {
  datasets[title].slug = snakeCase(title)
})

console.log(dedent`<!-- auto-generated by render.js -->

# Native Modules

> a list of ${packages.length} JavaScript modules with C++ addons

Find more datasets like this at 
[nice-registry/about](https://github.com/nice-registry/about#datasets).

## How?

This list is created by consuming the entire npm registry using 
[package-stream](http://ghub.io/package-stream), collecting all
packages that depend (or devDepend) on 
[nan](http://ghub.io/nan),
[node-pre-gyp](http://ghub.io/node-pre-gyp),
[prebuild](http://ghub.io/prebuild), or
[prebuildify](http://ghub.io/prebuildify).
Then [average daily downloads](http://ghub.io/download-counts) and 
[direct dependents](http://ghub.io/dependent-counts) counts are added
to the collected packages so they can be sorted by popularity.

## Lists

`)

Object.keys(datasets).forEach(title => {
  const {slug} = datasets[title]
  console.log(`- [${title}](#${slug})`)
})

Object.keys(datasets).forEach(title => {
  const {data, slug} = datasets[title]
  console.log(`\n\n<h2 id="${slug}">${title}</h2>`)
  console.log(tableify(data))
  console.log('<br><br><br><br><br><br>')
})
