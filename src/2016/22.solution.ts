import { Params } from 'aoc'
import { World } from 'declarations'

type Node = {
  size: number
  used: number
  avail: number
}
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  const world: World<Node> = []
  for await (const line of lineReader) {
    if (line.startsWith('/dev')) {
      const [, row, column, size, used, avail] = line?.match(
        /\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/
      )
      if (!world[+row]) world[+row] = []
      world[+row][+column] = { size: +size, used: +used, avail: +avail }
    }
  }

  if (!params.skipPart1) {
    for (let row1 = 0; row1 < world.length; row1++) {
      for (let row2 = 0; row2 < world.length; row2++) {
        for (let col1 = 0; col1 < world[0].length; col1++) {
          for (let col2 = 0; col2 < world[0].length; col2++) {
            if (row1 !== row2 || col1 !== col2) {
              if (world[row1][col1].used > 0 && world[row1][col1].used <= world[row2][col2].avail) part1++
            }
          }
        }
      }
    }
  }

  if (!params.skipPart2) {
  }

  return { part1, part2 }
}
