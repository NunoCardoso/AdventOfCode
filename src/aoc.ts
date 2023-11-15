import fs from 'fs'
import path from 'path'
import clc from 'cli-color'
import _ from 'lodash'
import { Config, Test, Prod } from 'aoc.d'

const defaultConfig = {
  logLevel: 'info',
  ui: { show: false },
  time: true
}

const bad = clc.red('Error')
const good = clc.green('OK')

const test = clc.cyan('test')
const prod = clc.red('prod')

export default async (config: Partial<Config> = {}) => {
  const _config = { ...defaultConfig, ...config }
  const app = require(
    './' + _config.year + '/' + _config.day + '/index' + (_config.mode ? '.' + _config.mode : '')
  ).default

  const doRun = async (run: Test | Prod, isTest: boolean) => {
    const targetFile = isTest ? (run as Test).id : 'input'

    const runConfig = {
      ...(_config.params ?? {}),
      isTest: isTest,
      logLevel: _config.logLevel,
      ui: _config.ui,
      ...run
    }

    let lineReader: any
    const file = path.join(__dirname, '/', _config.year!, '/', _config.day!, '/', targetFile + '.txt')
    if (fs.existsSync(file)) {
      lineReader = require('readline').createInterface({
        input: fs.createReadStream(file)
      })
    }
    if (_config.time) {
      console.time('Answer time ' + targetFile)
    }
    if (_config.mode) {
      console.log('Running ' + (_config.mode ?? 'normal'))
    }

    const answer = await app(lineReader, runConfig)
    if (_config.time) {
      console.timeEnd('Answer time ' + targetFile)
    }
    if (runConfig.part1?.skip === true) {
      console.log('Year', _config.year, 'Day', _config.day, 'Part 1', isTest ? 'test' : 'prod', '- skipped')
    } else {
      if (run?.part1) {
        console.log(
          'Year',
          _config.year,
          'Day',
          _config.day,
          'Part 1',
          isTest ? test : prod,
          '- got',
          answer.part1,
          run.part1.answer === answer.part1 ? good : 'Expected ' + run.part1.answer + ' ' + bad
        )
      }
    }
    if (runConfig.part2?.skip === true) {
      console.log('Year', _config.year, 'Day', _config.day, 'Part 2', isTest ? 'test' : 'prod', '- skipped')
    } else {
      if (run?.part2) {
        console.log(
          'Year',
          _config.year,
          'Day',
          _config.day,
          'Part 2',
          isTest ? test : prod,
          '- got',
          answer.part2,
          run.part2.answer === answer.part2 ? good : 'Expected ' + run.part2.answer + ' ' + bad
        )
      }
    }
  }

  const handleTest = (t: Test) => {
    if (t.skip !== true) {
      doRun(t, true)
    } else {
      console.log('Test run', t.id, 'skipped')
    }
  }

  if (_.get(_config, 'test')) {
    if (Array.isArray(_config.test)) {
      _config.test.forEach((t: Test) => handleTest(t))
    } else {
      handleTest(_config.test as Test)
    }
  }

  if (!!_.get(_config, 'prod') && _.get(_config, 'prod.skip') !== true) {
    doRun(_config.prod!, false)
  } else {
    console.log('Prod run skipped')
  }
}
