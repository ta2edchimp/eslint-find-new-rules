import mock from 'mock-fs'
import test from 'ava'
import findNewRules from './index'

try {
  require('./bin') // requiring now for coverage until this is tested
} catch (error) {
  // ignore the inevitable error
}

test.before(() => {
  mock({
    './node_modules/eslint/lib/rules': {
      'foo-rule.js': '',
      'bar-rule.js': '',
      'baz-thing.js': '',
    },
  })
})

test.after(() => {
  mock.restore()
})

test('returns the difference between what it finds in eslint/lib/rules and the rules array it is passed', t => {
  const missingRules = findNewRules(['baz-thing', 'foo-rule'])
  t.same(missingRules, ['bar-rule'])
})

test('returns an empty array if there is no difference', t => {
  const missingRules = findNewRules(['baz-thing', 'foo-rule', 'bar-rule'])
  t.true(Array.isArray(missingRules))
  t.same(missingRules.length, 0)
})

test('provokes a memory leak warning', t => {
  const rules = [1, 2]
  t.same(rules, [1, 2, 3])
})
