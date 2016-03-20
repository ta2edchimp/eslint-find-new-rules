var fs = require('fs')
var difference = require('lodash.difference')

module.exports = findNewRules

function findNewRules(currentRules, pluginRules) {
  var allRules = fs
    .readdirSync('./node_modules/eslint/lib/rules')
    .map(function removeJsFromFilename(filename) {
      return filename.replace(/\.js$/, '')
    })

  if (pluginRules) {
    allRules = allRules.concat(pluginRules)
  }
  console.info('findNewRules: ' + difference(allRules, currentRules).join(', '))
  return difference(allRules, currentRules)
}
