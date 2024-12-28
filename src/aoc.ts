import fs from 'fs'
import path from 'path'
import clc from 'cli-color'
import { Prod, PuzzleConfig, PuzzleOutput, Test } from './aoc.d'
const readline = require('readline')
import JSON5 from 'json5'

const defaultPuzzleConfig: Partial<PuzzleConfig> = {
  logLevel: 'info',
  ui: { show: false }
}

export default async (_year: string, _day: string, postPuzzleConfig = {}) => {
  let puzzleConfigPath = path.join(__dirname, _year + '/' + _day) + '.config'
  const rawPuzzleConfig: PuzzleConfig = require(puzzleConfigPath).default

  const puzzle = { ...defaultPuzzleConfig, ...rawPuzzleConfig, ...postPuzzleConfig } as PuzzleConfig
  const log = require('console-log-level')({ level: puzzle.logLevel })

  const year = puzzle.config.year.toString()
  const day = puzzle.config.day.toString().padStart(2, '0')
  const app = require(`./${year}/${day}${puzzle.mode ? '.' + puzzle.mode : ''}`).default

  const doRun = async (run: Test | Prod, isTest: boolean): Promise<PuzzleOutput> => {
    const result: PuzzleOutput = {
      config: puzzle.config,
      time: 0,
      mode: '',
      part1: {},
      part2: {},
      id: isTest ? (run as Test)?.id : 'Prod'
    }

    const runParams = {
      ...(puzzle.params ?? {}),
      ...(run.params ?? {}),
      logLevel: puzzle.logLevel,
      ui: puzzle.ui,
      isTest: isTest,
      skipPart1: run.answers.part1 === undefined,
      skipPart2: run.answers.part2 === undefined
    }

    if (runParams.skipPart1 && runParams.skipPart2) {
      return result
    }

    const targetFile = isTest ? (run as Test).id : 'input'
    let lineReader: any
    const file = path.join(__dirname, '../input/', year, '/', `${day}.${targetFile}.txt`)
    if (fs.existsSync(file)) {
      lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      })
    }

    result.time = new Date().getTime()
    const answer = await app(lineReader, runParams)
    result.time = new Date().getTime() - result.time

    if (!!run?.answers?.part1) {
      result.part1.skip = false
      result.part1.answer = answer.part1
      result.part1.expected = run.answers?.part1
    }

    if (!!run?.answers?.part2) {
      result.part2.skip = false
      result.part2.answer = answer.part2
      result.part2.expected = run.answers?.part2
    }

    return result
  }

  const printResult = (output: PuzzleOutput, isTest: boolean) => {
    const label = isTest ? '🎄 ' + clc.cyan(output.id) : '🎁 ' + clc.red(output.id)

    if (!output?.part1?.skip) {
      const success = output.part1.answer === output.part1.expected
      log.info(label + ' Part 1 -', output.part1.answer, success ? '✅' : '❌', !success ? '(Expected ' + output.part1.expected + ')' : '')
    }
    if (!output?.part2?.skip) {
      const success = output.part2.answer === output.part2.expected
      log.info(label + ' Part 2 -', output.part2.answer, success ? '✅' : '❌', !success ? '(Expected ' + output.part2.expected + ')' : '')
    }
  }

  const syncConfig = (output: PuzzleOutput, rawPuzzleConfig: PuzzleConfig) => {
    // sync config with results
    // note that day 25 only has one part
    if (output?.part1 && (output?.part2 || output.config.day === 25)) {
      let newStatus = output.part1.answer === output.part1.expected && (output.part2.answer === output.part2.expected || output.config.day === 25) ? 'solved' : 'unsolved'
      let newSpeed = rawPuzzleConfig!.config!.tags?.includes('MD5') ? 'md5' : output.time <= 1000 ? 'fast' : output.time <= 3000 ? 'medium' : 'slow'
      let newResult = rawPuzzleConfig!.config!.code === 'clean' && newStatus === 'solved' && ['fast', 'md5'].includes(newSpeed) ? 'finished' : 'unfinished'

      let changed = newStatus !== rawPuzzleConfig.config.status || newSpeed !== rawPuzzleConfig.config.speed || newResult !== rawPuzzleConfig.config.result

      if (changed) {
        console.log('Updating config...')
        fs.writeFileSync(puzzleConfigPath + '.ts', 'export default ' + JSON5.stringify(rawPuzzleConfig, null, 2))
      }
    }
  }

  log.info(`╔════════════════════════════════╗`)
  log.info(`║ 🎅 Advent of Code ${year} / ${day} 🎅 ║`)
  log.info(`╚════════════════════════════════╝`)

  if (Object.prototype.hasOwnProperty.call(puzzle, 'test')) {
    if (Array.isArray(puzzle.test)) {
      puzzle.test.forEach(async (t: Test) => await doRun(t, true))
    } else {
      let output = await doRun(puzzle.test as Test, true)
      log.info('Running ' + (output.mode ?? 'normal') + ' ⏰  ' + output.time + 'ms')
      printResult(output, true)
    }
  }

  if (Object.prototype.hasOwnProperty.call(puzzle, 'prod')) {
    let output = await doRun(puzzle.prod!, false)
    log.info('Running ' + (output.mode ?? 'normal') + ' ⏰  ' + output.time + 'ms')
    printResult(output, true)
    syncConfig(output, rawPuzzleConfig)
    return output
  }
}
