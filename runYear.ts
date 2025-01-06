const path = require('path')
const fs = require('fs')
import aoc from 'aoc'
import { PuzzleConfig, PuzzleOutput } from 'aoc.d'
const clc = require('cli-color')

if (process.argv[2]?.length !== 4) {
  console.error('usage: ts-node runYear {year}')
  process.exit()
}

let year = process.argv[2]
if (!fs.existsSync('reports')) fs.mkdirSync('reports')

let puzzles = fs.readdirSync(path.join('src', year)).filter((file: any) => file.endsWith('.config.ts'))

let resultFileMD = path.join('reports', year + '.md')
let resultFileTXT = path.join('reports', year + '.txt')

/*if (fs.existsSync(resultFileMD) || fs.existsSync(resultFileTXT)) {
  console.error('Error: report exists')
  process.exit()
}*/

const getPuzzle = async (p: any) => {
  const puzzle = require(path.join(process.argv[2] + '/' + p))
  let _p = { ...puzzle.default, logLevel: 'error', ui: {show: false} }
  delete _p.test
  return _p
}

let f = fs.openSync(resultFileMD, 'a+')
let f2 = fs.openSync(resultFileTXT, 'a+')
let totalTime = 0


const padCenter = (s: string, len: number)  => {
  let _s = s.substring(0, Math.floor(s.length / 2))
  let _s2 = s.substring(Math.floor(s.length / 2), s.length)
  return _s.padStart(Math.ceil(len/2), ' ')  + _s2.padEnd(Math.floor(len/2), ' ')
}

const renderTime = (time: number): string => {
  let dur = time / 1000.0
  return dur + 's'
}

const formatTime = (time: number) => {
  let dur = time / 1000.0
  return dur < 1 ? clc.green(dur + 's') : dur < 3 ? clc.yellow(dur + 's') : clc.red(dur + 's')
}

const getConsoleOutput = (results: PuzzleOutput[]): string[] => {

  let output: string[] = []
  let partialWidth = {day: 'day'.length, title: 'title'.length, part1: 'Part 1'.length, part2: 'Part 2'.length, time: 'time'.length}
  results.forEach(res => {
    if (res.config.day.toString().length > partialWidth.day) partialWidth.day = res.config.day.toString().length
    if (res.config.title.length > partialWidth.title) partialWidth.title = res.config.title.length
    if (res.part1.answer && res.part1.answer.toString().length > partialWidth.part1) partialWidth.part1 = res.part1.answer.toString().length
    if (res.part2.answer && res.part2.answer.toString().length > partialWidth.part2) partialWidth.part2 = res.part2.answer.toString().length
    if (res.time && renderTime(res.time).length > partialWidth.time) partialWidth.time = renderTime(res.time).length
   })
  let totalWidth = 1 + partialWidth.day + 3 + partialWidth.title + 3 + partialWidth.part1 + 3 + partialWidth.part2 + 3 + partialWidth.time + 1

  let string = ` 🎅 Advent of Code ${year} 🎅 `

  output.push('╔' + '═'.repeat(totalWidth) + '╗')
  output.push('║' + padCenter(string, totalWidth) + '║')

  output.push('╠' + '═'.repeat(partialWidth.day + 2) + '╦' + '═'.repeat(partialWidth.title + 2) + '╦' + '═'.repeat(partialWidth.part1 + 2) + '╦' +
    '═'.repeat(partialWidth.part2 + 2) + '╦' + '═'.repeat(partialWidth.time + 2) + '╣')

  output.push('║ ' + 'Day'.padEnd(partialWidth.day) + ' ║ ' + 'Title'.padEnd(partialWidth.title) + ' ║ ' + 'Part 1'.padEnd(partialWidth.part1) + ' ║ ' +
    'Part 2'.padEnd(partialWidth.part2) + ' ║ ' + 'Time'.padEnd(partialWidth.time) + ' ║')

  output.push('╠' + '═'.repeat(partialWidth.day + 2) + '╬' + '═'.repeat(partialWidth.title + 2) + '╬' + '═'.repeat(partialWidth.part1 + 2) + '╬' +
    '═'.repeat(partialWidth.part2 + 2) + '╬' + '═'.repeat(partialWidth.time + 2) + '╣')

  results.forEach(res => {
    let s = '║ '
    s += res.config.day.toString().padEnd(partialWidth.day, ' ')
    s += ' ║ '
    s += res.config.title.padEnd(partialWidth.title, ' ')
    s += ' ║ '
    s += (res.part1.answer ?? '-').toString().padEnd(partialWidth.part1, ' ')
    s += ' ║ '
    s += (res.part2.answer ?? '-').toString().padEnd(partialWidth.part2, ' ')
    s += ' ║ '
    s += formatTime(res.time ?? 0).padEnd(partialWidth.time, ' ')
    s += ' ║'
    output.push(s)
  })

  output.push('╚' + '═'.repeat(partialWidth.day + 2) + '╩' + '═'.repeat(partialWidth.title + 2) + '╩' + '═'.repeat(partialWidth.part1 + 2) + '╩' +
    '═'.repeat(partialWidth.part2 + 2) + '╩' + '═'.repeat(partialWidth.time + 2) + '╝')
  return output
}
const getMdOutput = (results: PuzzleOutput[], totalTime: number): string => {
  let s  = ''
  results.forEach(res => {
    let md = path.join(__dirname, 'src', year, res.config.day.toString().padStart(2, '0') + '.readme.md')
    let mdS = fs.readFileSync(md)
    s += mdS + '\n'
    s += 'Status: ' + res.config.status + '\n\n'
    if (res.config?.tags) s += 'Tags: ' + res.config?.tags.join(', ') + '\n\n'
  })
  s += 'Total time: ' + totalTime / 1000.0 + 's' + '\n\n'
  return s
}

Promise.all(puzzles.map(getPuzzle)).then(async (puzzles: PuzzleConfig[]) => {
  let results: PuzzleOutput[] = []
  for(let puzzle of puzzles)  {
    let res = await aoc(puzzle!) as PuzzleOutput
    results.push(res)
    console.clear()
    getConsoleOutput(results).map(c => console.log(c))
    totalTime += res.time
  }
  let consoleOutput = getConsoleOutput(results)
  fs.writeSync(f2, consoleOutput.join('\n'))

  let mdOutput = getMdOutput(results, totalTime)
  fs.writeSync(f, mdOutput)
})
