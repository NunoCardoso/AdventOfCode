const path = require('path')
const fs = require('fs')
import aoc from 'aoc'
import { PuzzleConfig, PuzzleOutput, PuzzleOutputAnswer } from 'aoc.d'
var readline = require('readline')
var rl = readline.createInterface(process.stdin, process.stdout)

if (process.argv[2]?.length !== 4) {
  console.error('usage: ts-node runYear {year}')
  process.exit()
}

let year = process.argv[2]
if (!fs.existsSync('reports')) fs.mkdirSync('reports')

let puzzles = fs.readdirSync(path.join('src', year)).filter((file: any) => file.endsWith('.config.ts'))

let resultFileMD = path.join('reports', year + '.md')
let resultFileTXT = path.join('reports', year + '.txt')

const getPuzzle = async (p: any) => {
  const puzzle = require(path.join(process.argv[2] + '/' + p))
  let _p = { ...puzzle.default, logLevel: 'error', ui: { show: false } }
  delete _p.test
  return _p
}

const padCenter = (s: string, len: number) => {
  let _s = s.substring(0, Math.floor(s.length / 2))
  let _s2 = s.substring(Math.floor(s.length / 2), s.length)
  return _s.padStart(Math.ceil(len / 2), ' ') + _s2.padEnd(Math.floor(len / 2), ' ')
}

const renderTime = (time: number): string => {
  let dur = time / 1000.0
  let badge = dur < 1 ? '🟢' : dur < 2 ? '🟡' : '🔴'
  return badge + ' ' + dur + 's'
}

const renderTags = (tags: string[]): string => tags.join(', ')

const difficultyList: string[] = ['', '🐣 Very easy', '🕺 Easy', '🔨 Medium', '😡 Hard', '☠️ Very hard']
const renderDifficulty = (d: number): string => difficultyList[d]

const renderAnswer = (part: PuzzleOutputAnswer) => {
  if (!part || part.skip) return '⚪'
  let renderedPart =
    part.answer!.toString().indexOf('\n') >= 0
      ? part.answer!.toString().substring(0, part.answer!.toString().indexOf('\n'))
      : part.answer!.toString()

  let badge = part.answer === part.expected ? '🟢' : '🔴'
  return badge + ' ' + renderedPart
}

const getConsoleOutput = (results: PuzzleOutput[]): string[] => {
  let output: string[] = []
  let partialWidth = {
    day: 'day'.length,
    title: 'title'.length,
    difficulty: 'Difficulty'.length,
    part1: 'Part 1'.length,
    part2: 'Part 2'.length,
    time: 'time'.length,
    tags: 'tags'.length
  }
  results.forEach((res) => {
    if (res.config.day.toString().length > partialWidth.day) partialWidth.day = res.config.day.toString().length
    if (res.config.title.length > partialWidth.title) partialWidth.title = res.config.title.length
    if (renderDifficulty(res.config.difficulty).length > partialWidth.difficulty)
      partialWidth.difficulty = renderDifficulty(res.config.difficulty).length
    if (renderAnswer(res.part1).length > partialWidth.part1) partialWidth.part1 = renderAnswer(res.part1).length
    if (renderAnswer(res.part2).length > partialWidth.part2) partialWidth.part2 = renderAnswer(res.part2).length
    if (res.time && renderTime(res.time).length > partialWidth.time) partialWidth.time = renderTime(res.time).length
    if (renderTags(res.config.tags ?? []).length > partialWidth.tags)
      partialWidth.tags = renderTags(res.config.tags ?? []).length
  })
  let totalWidth =
    1 +
    partialWidth.day +
    3 +
    partialWidth.title +
    3 +
    partialWidth.difficulty +
    3 +
    partialWidth.part1 +
    3 +
    partialWidth.part2 +
    3 +
    partialWidth.time +
    3 +
    partialWidth.tags +
    1

  let string = ` 🎅 Advent of Code ${year} 🎅 `

  output.push('╔' + '═'.repeat(totalWidth) + '╗')
  output.push('║' + padCenter(string, totalWidth) + '║')

  output.push(
    '╠' +
      '═'.repeat(partialWidth.day + 2) +
      '╦' +
      '═'.repeat(partialWidth.title + 2) +
      '╦' +
      '═'.repeat(partialWidth.difficulty + 2) +
      '╦' +
      '═'.repeat(partialWidth.part1 + 2) +
      '╦' +
      '═'.repeat(partialWidth.part2 + 2) +
      '╦' +
      '═'.repeat(partialWidth.time + 2) +
      '╦' +
      '═'.repeat(partialWidth.tags + 2) +
      '╣'
  )

  output.push(
    '║ ' +
      'Day'.padEnd(partialWidth.day) +
      ' ║ ' +
      'Title'.padEnd(partialWidth.title) +
      ' ║ ' +
      'Difficulty'.padEnd(partialWidth.difficulty) +
      ' ║ ' +
      'Part 1'.padEnd(partialWidth.part1) +
      ' ║ ' +
      'Part 2'.padEnd(partialWidth.part2) +
      ' ║ ' +
      'Time'.padEnd(partialWidth.time) +
      ' ║ ' +
      'Tags'.padEnd(partialWidth.tags) +
      ' ║'
  )

  output.push(
    '╠' +
      '═'.repeat(partialWidth.day + 2) +
      '╬' +
      '═'.repeat(partialWidth.title + 2) +
      '╬' +
      '═'.repeat(partialWidth.difficulty + 2) +
      '╬' +
      '═'.repeat(partialWidth.part1 + 2) +
      '╬' +
      '═'.repeat(partialWidth.part2 + 2) +
      '╬' +
      '═'.repeat(partialWidth.time + 2) +
      '╬' +
      '═'.repeat(partialWidth.tags + 2) +
      '╣'
  )

  results.forEach((res) => {
    let s = '║ '
    s += res.config.day.toString().padEnd(partialWidth.day, ' ')
    s += ' ║ '
    s += res.config.title.padEnd(partialWidth.title, ' ')
    s += ' ║ '
    s += renderDifficulty(res.config.difficulty).padEnd(partialWidth.difficulty, ' ')
    s += ' ║ '
    s += renderAnswer(res.part1).padEnd(partialWidth.part1, ' ')
    s += ' ║ '
    s += renderAnswer(res.part2).padEnd(partialWidth.part2, ' ')
    s += ' ║ '
    s += renderTime(res.time ?? 0).padEnd(partialWidth.time, ' ')
    s += ' ║ '
    s += renderTags(res.config.tags ?? []).padEnd(partialWidth.tags, ' ')
    s += ' ║'
    output.push(s)
  })

  output.push(
    '╚' +
      '═'.repeat(partialWidth.day + 2) +
      '╩' +
      '═'.repeat(partialWidth.title + 2) +
      '╩' +
      '═'.repeat(partialWidth.difficulty + 2) +
      '╩' +
      '═'.repeat(partialWidth.part1 + 2) +
      '╩' +
      '═'.repeat(partialWidth.part2 + 2) +
      '╩' +
      '═'.repeat(partialWidth.time + 2) +
      '╩' +
      '═'.repeat(partialWidth.tags + 2) +
      '╝'
  )
  return output
}
const getMdOutput = (results: PuzzleOutput[], totalTime: number): string => {
  let s = ''
  results.forEach((res) => {
    let md = path.join(__dirname, 'src', year, res.config.day.toString().padStart(2, '0') + '.readme.md')
    let mdS = fs.readFileSync(md)
    if (mdS) s += mdS + '\n'
    s += 'Status: ' + res.config.status + '\n\n'
    if (res.config?.tags) s += 'Tags: ' + res.config?.tags.join(', ') + '\n\n'
  })
  s += 'Total time: ' + totalTime / 1000.0 + 's' + '\n\n'
  return s
}
const proceed = async () => {
  let f = fs.openSync(resultFileMD, 'w+')
  let f2 = fs.openSync(resultFileTXT, 'w+')
  let totalTime = 0
  let currentPuzzle: PuzzleConfig
  Promise.all(puzzles.map(getPuzzle))
    .then(async (puzzles: PuzzleConfig[]) => {
      // console.log('Puzzles ', puzzles)
      let results: PuzzleOutput[] = []
      for (let puzzle of puzzles) {
        currentPuzzle = puzzle
        let res = (await aoc(puzzle!)) as PuzzleOutput
        results.push(res)
        console.clear()
        getConsoleOutput(results).map((c) => console.log(c))
        totalTime += res.time
      }
      let consoleOutput = getConsoleOutput(results)
      fs.writeSync(f2, consoleOutput.join('\n'))

      let mdOutput = getMdOutput(results, totalTime)
      fs.writeSync(f, mdOutput)
    })
    .catch((e) => {
      console.error(currentPuzzle)
      console.error(e)
    })
    .finally(() => {
      console.log('done')
      process.exit()
    })
}

if (fs.existsSync(resultFileMD) || fs.existsSync(resultFileTXT)) {
  rl.question('Report exists. Overwrite? [yes]/no: ', (answer: string) => {
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes' && answer !== '') {
      console.error('Error: report exists')
      process.exit()
    } else {
      proceed()
    }
  })
} else {
  proceed()
}
