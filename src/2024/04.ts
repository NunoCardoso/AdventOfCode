import { Params } from 'aoc.d'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0
  let world: World<string> = []
  for await (const line of lineReader) world.push(line.split(''))

  const restOfWordsPart1 = (i: number, j: number): number => {
    let count = 0
    if (i - 3 >= 0) {
      // w, nw, sw
      if ([world[i - 1][j], world[i - 2][j], world[i - 3][j]].join('') === 'MAS') count++
      if (j - 3 >= 0 && [world[i - 1][j - 1], world[i - 2][j - 2], world[i - 3][j - 3]].join('') === 'MAS') count++
      if (j + 3 < world[i].length && [world[i - 1][j + 1], world[i - 2][j + 2], world[i - 3][j + 3]].join('') === 'MAS') count++
    }
    if (i + 3 < world.length) {
      // e, ne, se
      if ([world[i + 1][j], world[i + 2][j], world[i + 3][j]].join('') === 'MAS') count++
      if (j - 3 >= 0 && [world[i + 1][j - 1], world[i + 2][j - 2], world[i + 3][j - 3]].join('') === 'MAS') count++
      if (j + 3 < world[i].length && [world[i + 1][j + 1], world[i + 2][j + 2], world[i + 3][j + 3]].join('') === 'MAS') count++
    }
    // n, s
    if (j - 3 >= 0 && [world[i][j - 1], world[i][j - 2], world[i][j - 3]].join('') === 'MAS') count++
    if (j + 3 < world[i].length && [world[i][j + 1], world[i][j + 2], world[i][j + 3]].join('') === 'MAS') count++
    return count
  }

  const restOfWordsPart2 = (i: number, j: number): number => {
    let count = 0
    if (i - 1 >= 0 && j - 1 >= 0 && i + 1 < world.length && j + 1 < world[i].length) {
      if ([world[i - 1][j - 1], world[i - 1][j + 1], world[i + 1][j + 1], world[i + 1][j - 1]].join('') === 'MMSS') count++
      if ([world[i - 1][j + 1], world[i + 1][j + 1], world[i + 1][j - 1], world[i - 1][j - 1]].join('') === 'MMSS') count++
      if ([world[i + 1][j + 1], world[i + 1][j - 1], world[i - 1][j - 1], world[i - 1][j + 1]].join('') === 'MMSS') count++
      if ([world[i + 1][j - 1], world[i - 1][j - 1], world[i - 1][j + 1], world[i + 1][j + 1]].join('') === 'MMSS') count++
    }
    return count
  }

  world.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col === 'X') part1 += restOfWordsPart1(i, j)
      if (col === 'A') part2 += restOfWordsPart2(i, j)
    })
  })

  return { part1, part2 }
}
