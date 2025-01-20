import fs from 'fs'
import path from 'path'
import clc from 'cli-color'
import { Prod, PuzzleConfig, PuzzleOutput, Result, Speed, Status, Test } from './aoc.d'
const readline = require('readline')

const padCenter = (s: string, len: number) => {
  let _s = s.substring(0, Math.floor(s.length / 2))
  let _s2 = s.substring(Math.floor(s.length / 2), s.length)
  return _s.padStart(Math.ceil(len / 2), ' ') + _s2.padEnd(Math.floor(len / 2), ' ')
}

export default async (puzzle: PuzzleConfig) => {
  const log = require('console-log-level')({ level: puzzle.logLevel })

  const year = puzzle.config.year.toString()
  const day = puzzle.config.day.toString().padStart(2, '0')
  const app = require(`./${year}/${day}${puzzle.mode ? '.' + puzzle.mode : ''}`).default

  const doRun = async (run: Test | Prod, isTest: boolean) => {
    const result: PuzzleOutput = {
      config: puzzle.config,
      mode: puzzle?.mode ?? '',
      time: 0,
      part1: {},
      part2: {},
      skipped: false,
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
      result.skipped = true
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

    if (puzzle.config.tags?.includes('MD5')) {
      log.warn('This will take some time, MD5 puzzle')
    }

    result.time = new Date().getTime()
    const answer = await app(lineReader, runParams)
    result.time = new Date().getTime() - result.time

    if (!runParams.skipPart1) {
      result.part1.skip = false
      result.part1.answer = answer.part1
      result.part1.expected = run.answers?.part1
    } else {
      result.part1.skip = true
    }

    if (!runParams.skipPart2) {
      result.part2.skip = false
      result.part2.answer = answer.part2
      result.part2.expected = run.answers?.part2
    } else {
      result.part2.skip = true
    }
    return result
  }

  const printResult = (output: PuzzleOutput, isTest: boolean) => {
    const label = isTest ? '🎄 ' + clc.cyan(output.id) : '🎁 ' + clc.red(output.id)

    if (!output?.part1?.skip) {
      const success = output.part1.answer === output.part1.expected
      console.info(
        label + ' Part 1 -',
        output.part1.answer,
        success ? '✅' : '❌',
        !success ? '(Expected ' + output.part1.expected + ')' : ''
      )
    }
    if (!output?.part2?.skip) {
      const success = output.part2.answer === output.part2.expected
      console.info(
        label + ' Part 2 -',
        output.part2.answer,
        success ? '✅' : '❌',
        !success ? '(Expected ' + output.part2.expected + ')' : ''
      )
    }
  }

  const syncConfig = (output: PuzzleOutput, rawPuzzleConfig: PuzzleConfig) => {
    // sync config with results
    // note that day 25 only has one part
    if (output?.part1 && (output?.part2 || output.config.day === 25)) {
      let newStatus: Status =
        output.part1.answer === output.part1.expected &&
        (output.part2.answer === output.part2.expected || output.config.day === 25)
          ? 'solved'
          : 'unsolved'
      let newSpeed: Speed = rawPuzzleConfig!.config!.tags?.includes('MD5')
        ? 'md5'
        : output.time <= 1000
          ? 'fast'
          : output.time <= 3000
            ? 'medium'
            : 'slow'
      let newResult: Result =
        rawPuzzleConfig!.config!.code === 'clean' && newStatus === 'solved' && ['fast', 'md5'].includes(newSpeed)
          ? 'finished'
          : 'unfinished'
      let changed =
        newStatus !== rawPuzzleConfig.config.status ||
        newSpeed !== rawPuzzleConfig.config.speed ||
        newResult !== rawPuzzleConfig.config.result

      if (changed) {
        let puzzleConfigPath = path.join(__dirname, year, day + '.config')
        let content = fs.readFileSync(puzzleConfigPath + '.ts', 'utf8')
        console.log('Updating config...')
        content = content
          .replaceAll(/status: '(.+)'/g, `status: '${newStatus}'`)
          .replaceAll(/speed: '(.+)'/g, `speed: '${newSpeed}'`)
          .replaceAll(/result: '(.+)'/g, `result: '${newResult}'`)
        fs.writeFileSync(puzzleConfigPath + '.ts', content)
      }
    }
  }

  let string = ` 🎅 Advent of Code ${year} / ${day} 🎅 `
  let title = puzzle.config.title
  let biggestString = Math.max(string.length, title.length)

  console.info('╔' + '═'.repeat(biggestString) + '╗')
  console.info(`║${padCenter(string, biggestString)}║`)
  console.info(`║${padCenter(title, biggestString)}║`)
  console.info('╚' + '═'.repeat(biggestString) + '╝')

  if (Object.prototype.hasOwnProperty.call(puzzle, 'test')) {
    if (Array.isArray(puzzle.test)) {
      puzzle.test.forEach(async (t: Test) => {
        let output = await doRun(t, true)
        if (!output.skipped) {
          console.info('Running ' + (output.mode ?? 'normal') + ' ⏰  ' + output.time + 'ms')
          printResult(output, true)
        }
      })
    } else {
      let output = await doRun(puzzle.test as Test, true)
      if (!output.skipped) {
        console.info('Running ' + (output.mode ?? 'normal') + ' ⏰  ' + output.time + 'ms')
        printResult(output, true)
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(puzzle, 'prod')) {
    let output = await doRun(puzzle.prod!, false)
    if (!output.skipped) {
      console.info('Running ' + (output.mode ?? 'normal') + ' ⏰  ' + output.time + 'ms')
      printResult(output, false)
      syncConfig(output, puzzle)
      return output
    }
  }
}
