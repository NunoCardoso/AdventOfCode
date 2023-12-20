import fs from 'fs'
import path from 'path'
import clc from 'cli-color'
import { Puzzle, Test, Prod, Result } from './aoc.d'
const readline = require('readline')

const defaultConfig = {
  logLevel: 'info',
  ui: { show: false }
}

export default async (puzzle: Partial<Puzzle> = {}, log = true) => {
  const _puzzle = { ...defaultConfig, ...puzzle } as Puzzle
  const app = require(
    './' +
      _puzzle.config.year +
      '/' +
      _puzzle.config.day +
      '/index' +
      (_puzzle.mode ? '.' + _puzzle.mode : '')
  ).default

  const doRun = async (run: Test | Prod, isTest: boolean): Promise<Result> => {
    const result: Result = {
      config: _puzzle.config,
      time: 0,
      mode: '',
      part1: {
        skip: true,
        status: ''
      },
      part2: {
        skip: true,
        status: ''
      }
    }

    const targetFile = isTest ? (run as Test).id : 'input'

    let line = '📅 ' + _puzzle.config.year + '/' + _puzzle.config.day + ' '
    line += (isTest ? clc.cyan((run as Test)?.id) : clc.red('Prod')) + ' '

    const runParams = {
      ...(_puzzle.params ?? {}),
      ...(run.params ?? {}),
      logLevel: _puzzle.logLevel,
      ui: _puzzle.ui,
      isTest: isTest,
      skip: run.skip,
      skipPart1: run.skip === true || run.skip === 'part1',
      skipPart2: run.skip === true || run.skip === 'part2'
    }

    if (run.skip === true) {
      if (log) console.log(line + clc.red('- skipped'))
      return result
    }

    let lineReader: any
    const file = path.join(
      __dirname,
      '/',
      _puzzle.config.year!,
      '/',
      _puzzle.config.day!,
      '/',
      targetFile + '.txt'
    )
    if (fs.existsSync(file)) {
      lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      })
    }
    if (_puzzle.mode) {
      if (log) console.log('Running ' + (_puzzle.mode ?? 'normal'))
    }

    if (log) console.time('Answer time ' + targetFile)
    else result.time = new Date().getTime()

    const answer = await app(lineReader, runParams)

    if (log) console.timeEnd('Answer time ' + targetFile)
    else result.time = new Date().getTime() - result.time

    if (runParams.skip === 'part1') {
      if (log) console.log(line + clc.red('- Part 1 - skipped'))
    } else {
      if (run?.answers?.part1 !== undefined) {
        const status = run.answers?.part1 === answer.part1 ? '✅' : '❌'
        if (log) {
          console.log(
            line + 'Part 1 -',
            answer.part1,
            status,
            status === '❌' ? '(Expected ' + run.answers?.part1 + ')' : ''
          )
        }
        result.part1.skip = false
        result.part1.status = status
      }
    }
    if (runParams.skip === 'part2') {
      if (log) console.log(line + clc.red('- Part 2 - skipped'))
    } else {
      if (run?.answers?.part2 !== undefined) {
        const status = run.answers?.part2 === answer.part2 ? '✅' : '❌'
        if (log) {
          console.log(
            line + 'Part 2 -',
            answer.part2,
            status,
            status === '❌' ? '(Expected ' + run.answers?.part2 + ')' : ''
          )
        }
        result.part2.skip = false
        result.part2.status = status
      }
    }
    return result
  }

  if (Object.prototype.hasOwnProperty.call(_puzzle, 'test')) {
    if (Array.isArray(_puzzle.test)) {
      _puzzle.test.forEach((t: Test) => doRun(t, true))
    } else {
      await doRun(_puzzle.test as Test, true)
    }
  }

  if (Object.prototype.hasOwnProperty.call(_puzzle, 'prod')) {
    return await doRun(_puzzle.prod!, false)
  }
}
