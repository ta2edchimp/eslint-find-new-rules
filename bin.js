#!/usr/bin/env node

'use strict'

// Prints rules recognized by ESLint that don't appear in the given config
// preset. It helps with upgrading the preset when new ESLint gets released.
var path = require('path')
var isAbsolute = require('path-is-absolute')
var union = require('lodash.union')
var findNewRules = require('./index')

var currentRules = getRules()
var newRules = findNewRules(currentRules)

if (newRules.length) {
  console.log('New rules to add to the config: ' + newRules.join(', ') + '.') // eslint-disable-line no-console
  process.exit(1)
}

function getConfig(extendingConfigFile) {
  var specifiedFile = process.argv[2]
  if (extendingConfigFile) {
    return require(extendingConfigFile)
  } else if (specifiedFile) {
    // this is being called like: eslint-find-new-rules eslint-config-mgol
    if (isAbsolute(specifiedFile)) {
      return require(specifiedFile)
    } else {
      return require(path.join(process.cwd(), specifiedFile))
    }
  } else {
    // this is not being called with an arg. Use the package.json `main`
    return require(process.cwd())
  }
}

function getRules(set) {
  var configFileName = set ? ('eslint-config-' + set) : null
  var config = getConfig(configFileName)
  var rules = Object.keys(config.rules)
  if (config.extends) {
    rules = union(rules, getRules(config.extends))
  }
  return rules
}
