import test from 'ava'
import path from 'path'
import proxyquire from 'proxyquire'

let rules = []
const processCwd = process.cwd
const processExit = process.exit
const consoleLog = console.log // eslint-disable-line no-console
const noSpecifiedFile = path.resolve(process.cwd(), './fixtures/no-path')
const specifiedFile = './fixtures/.eslintrc.js'
const mainFile = path.join(process.cwd(), specifiedFile)
const extendingFile = './fixtures/extending-config.json'
const indexStub = {
  'eslint-plugin-react': {
    rules: {
      'jsx-uses-react': true,
      'no-multi-comp': true,
      'prop-types': true,
    },
    '@noCallThru': true,
    '@global': true,
  },
  fs: {
    readdirSync: () => ['foo-rule.js', 'bar-rule.js', 'baz-thing.js', 'something-new.js'],
    '@global': true,
  },
}
function outputStatement() {
  console.info(`New rules to add to the config: ${rules.join(', ')}.`)
  return `New rules to add to the config: ${rules.join(', ')}.`
}

test.beforeEach((t) => {
  process.argv.splice(2, process.argv.length)
  process.exit = status => t.same(status, 1)
  console.log = statement => t.same(statement, outputStatement()) // eslint-disable-line no-console
})

test.afterEach(() => {
  process.cwd = processCwd
  process.exit = processExit
  console.log = consoleLog // eslint-disable-line no-console
})

test('no new rule and absolute path', () => {
  process.argv[2] = mainFile
  proxyquire('../bin', indexStub)
})

test('no new rule and relative path', () => {
  process.argv[2] = specifiedFile
  proxyquire('../bin', indexStub)
})

test('no new rule and no path', () => {
  process.cwd = () => noSpecifiedFile
  proxyquire('../bin', indexStub)
})

test('new rule and absolute path', () => {
  rules = ['foo']
  process.argv[2] = mainFile
  proxyquire('../bin', indexStub)
})

test('new rule and relative path', () => {
  rules = ['foo', 'bar']
  process.argv[2] = specifiedFile
  proxyquire('../bin', indexStub)
})

test('new rule and no path', () => {
  rules = ['foo', 'bar', 'baz']
  process.cwd = () => noSpecifiedFile
  proxyquire('../bin', indexStub)
})

test('new rule (extending)', () => {
  rules = ['comma-dangle', 'no-console', 'no-alert']
  process.argv[2] = extendingFile
  proxyquire('../bin', indexStub)
})
