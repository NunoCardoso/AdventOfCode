const path = require('path')
const fs = require('fs')
import aoc from 'aoc'
import { Result } from 'aoc.d'

if (process.argv[2]?.length !== 4) {
  console.error("usage: ts-node runYear {year}")
  process.exit()
}

let puzzles = fs.readdirSync(path.join( 'src', process.argv[2])).filter((file: any) => file.endsWith('.ts'))

let resultFile = path.join( 'src', process.argv[2], 'results.txt')

if (fs.existsSync(resultFile)) {
  console.error("Error: " + resultFile + " exists")
  process.exit()
}

const getConfig = async (p: any) => {
  const puzzle =  require(path.join(process.argv[2] + '/' + p))
  let spicedConfig = {...puzzle.default}
  delete spicedConfig.test
  spicedConfig.logLevel = 'warn'
  spicedConfig.ui = {show: false}
  return spicedConfig
}


let f = fs.openSync(resultFile, 'a+')
fs.writeSync(f, 'Day |  Time  | P1 | P2 | Title, comment\n')
Promise.all(puzzles.map(getConfig)).then(async (x: Array<any>) => {
  while(x.length > 0) {
    let c = x.shift()
    let res: Result = await aoc(c, false) as Result
    let dur = res.time / 1000.0 + 's'
    let status = ' ' + res.config.day + ' | ' +  dur + ' | ' + res.part1.status + ' | ' + res.part2.status +
       ' | ' + (res.config?.title ?? 'No title') + ' - ' + (res.config?.comment ?? 'No comment')
    console.log(status)
    fs.writeSync(f, status + '\n')
  }
})
