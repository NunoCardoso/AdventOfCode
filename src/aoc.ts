import fs from 'fs'
import path from 'path'
import clc from 'cli-color'
import { Config, Test, Prod } from 'aoc.d'
const readline = require('readline')

const defaultConfig = {
  logLevel: 'info',
  ui: { show: false },
  time: true
}

export default async (config: Partial<Config> = {}) => {
  const _config = { ...defaultConfig, ...config }
  const app = require(
    './' + _config.year + '/' + _config.day + '/index' + (_config.mode ? '.' + _config.mode : '')
  ).default

  const doRun = async (run: Test | Prod, isTest: boolean) => {
    const targetFile = isTest ? (run as Test).id : 'input'

    let line = '📅 ' + _config.year + '/' + _config.day + ' '
    line += (isTest ? clc.cyan((run as Test)?.id) : clc.red('Prod')) + ' '

    const runConfig = {
      ...(_config.params ?? {}),
      ...(run.params ?? {}),
      logLevel: _config.logLevel,
      ui: _config.ui,
      time: _config.time,
      isTest: isTest,
      skip: run.skip,
      skipPart1: run.skip === true || run.skip === 'part1',
      skipPart2: run.skip === true || run.skip === 'part2'
    }

    if (run.skip === true) {
      console.log(line + clc.red('- skipped'))
      return
    }

    let lineReader: any
    const file = path.join(__dirname, '/', _config.year!, '/', _config.day!, '/', targetFile + '.txt')
    if (fs.existsSync(file)) {
      lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      })
    }
    if (_config.mode) {
      console.log('Running ' + (_config.mode ?? 'normal'))
    }

    if (_config.time) {
      console.time('Answer time ' + targetFile)
    }

    const answer = await app(lineReader, runConfig)
    if (_config.time) {
      console.timeEnd('Answer time ' + targetFile)
    }

    if (runConfig.skip === 'part1') {
      console.log(line + clc.red('- Part 1 - skipped'))
    } else {
      if (run?.answers?.part1 !== undefined) {
        console.log(
          line + 'Part 1 -',
          answer.part1,
          run.answers?.part1 === answer.part1 ? '✅ ' : '❌ (Expected ' + run.answers?.part1 + ')'
        )
      }
    }
    if (runConfig.skip === 'part2') {
      console.log(line + clc.red('- Part 2 - skipped'))
    } else {
      if (run?.answers?.part2 !== undefined) {
        console.log(
          line + 'Part 2 -',
          answer.part2,
          run.answers?.part2 === answer.part2 ? '✅ ' : '❌ (Expected ' + run.answers?.part2 + ')'
        )
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(_config, 'test')) {
    if (Array.isArray(_config.test)) {
      _config.test.forEach((t: Test) => doRun(t, true))
    } else {
      await doRun(_config.test as Test, true)
    }
  }

  if (Object.prototype.hasOwnProperty.call(_config, 'prod')) {
    await doRun(_config.prod!, false)
  }
}
