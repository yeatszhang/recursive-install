var path = require('path')
var shell = require('shelljs')
var assert = require('assert')

var script = path.join(__dirname, '../recursive-install.js')

describe('recursive install', function () {
  var cwd = path.join(shell.tempdir(), 'recursive-install')
  var installedPaths = [
    '.',
    '/hello/world',
    '/foo/bar'
  ]

  var notInstalledPaths = [
    '/node_modules/a-module'
  ]

  shell.rm('-r', cwd)
  shell.mkdir(cwd)

  installedPaths.concat(notInstalledPaths).forEach(function (p) {
    var newPath = path.join(cwd, p)
    shell.mkdir('-p', newPath)
    shell.cp(__dirname + '/test-package.json', newPath + '/package.json')
  })

  shell.cd(cwd)

  var result = shell.exec(script, {silent: true})

  it('exits with code 0', function () {
    assert(result.code === 0)
  })

  it('installs packages', function () {
    installedPaths.forEach(function (p) {
      assert(shell.test('-d', path.join(cwd, p, 'node_modules')))
    })
  })

  it('doesn\'t install packages in node_modules', function () {
    notInstalledPaths.forEach(function (p) {
      assert(!shell.test('-d', path.join(cwd, p, 'node_modules')))
    })
  })
})
