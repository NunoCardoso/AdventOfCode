import * as path from 'path'
import aoc from 'aoc'

if (process.argv[2]?.length !== 4 && !process.argv[2]?.startsWith('20')) {
  console.error('usage: ts-node runDay {year} {day}')
  process.exit()
}

if (process.argv[3]?.length < 1 && process.argv[3]?.length > 2) {
  console.error('usage: ts-node runDay {year} {day}')
  process.exit()
}

aoc(process.argv[2], process.argv[3].padStart(2, '0'))
