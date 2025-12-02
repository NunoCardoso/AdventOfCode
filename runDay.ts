import aoc from 'aoc'
import { PuzzleConfig } from 'aoc.d'
import * as path from 'path'

if (process.argv[2]?.length !== 4 && !process.argv[2]?.startsWith('20')) {
  console.error('usage: ts-node runDay {year} {day}')
  process.exit()
}

if (process.argv[3]?.length < 1 && process.argv[3]?.length > 2) {
  console.error('usage: ts-node runDay {year} {day}')
  process.exit()
}

let puzzleConfigPath = path.join(__dirname, 'src', process.argv[2], process.argv[3].padStart(2, '0') + '.config')
const rawPuzzleConfig: PuzzleConfig = require(puzzleConfigPath).default
aoc(rawPuzzleConfig)
