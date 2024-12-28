const path = require('path')
const fs = require('fs')
import aoc from 'aoc'
import { Result } from 'aoc.d'
const clc = require('cli-color')

if (process.argv[2]?.length !== 4) {
  console.error('usage: ts-node runYear {year}')
  process.exit()
}

if (!fs.existsSync('reports')) fs.mkdirSync('reports')

let puzzles = fs.readdirSync(path.join('src', process.argv[2])).filter((file: any) => {
  return file.endsWith('.config.ts')
})

let resultFile = path.join('reports', process.argv[2] + '.md')

if (fs.existsSync(resultFile)) {
  console.error('Error: ' + resultFile + ' exists')
  process.exit()
}

const getConfig = async (p: any) => {
  const puzzle = require(path.join(process.argv[2] + '/' + p))
  let spicedConfig = { ...puzzle.default }
  delete spicedConfig.test
  spicedConfig.logLevel = 'warn'
  spicedConfig.ui = { show: false }
  return spicedConfig
}

let f = fs.openSync(resultFile, 'a+')
let total = 0
Promise.all(puzzles.map(getConfig)).then(async (days: Array<any>) => {
  while (days.length > 0) {
    let day = days.shift()
    let res: Result = (await aoc(day, false)) as Result
    total += res.time
    let dur = res.time / 1000.0
    let durString = dur < 1 ? clc.green(dur + 's') : dur < 3 ? clc.yellow(dur + 's') : clc.red(dur + 's')
    let status = clc.cyan('Day ' + res.config.day + ': ' + (res.config?.title ?? 'No title')) + '\n'
    if (!res.config?.title) console.error('No title')
    if (res.config.status) status += 'Status: ' + res.config.status + '\n'
    if (!res.config?.status) console.error('No Status')
    status += 'Difficulty: ' + (res.config?.difficulty ?? '-') + '\n'
    if (!res.config?.difficulty) console.error('No Difficulty')
    if (res.config?.tags)
      status += 'Tags: ' + (Array.isArray(res.config?.tags) ? res.config?.tags.join(', ') : res.config?.tags) + '\n'
    if (res.config.comment) status += 'Comment: ' + res.config.comment + '\n'
    if (!res.config?.comment) console.error('No Comment')
    status += 'Part 1 ' + res.part1.status + '  part 2 ' + res.part2.status + '  in ' + durString + '\n'
    status += '\n'
    console.log(status)
    fs.writeSync(f, status)
  }
  let status = 'Total: ' + total / 1000.0 + 's'
  console.log(status)
  fs.writeSync(f, status + '\n')
})
