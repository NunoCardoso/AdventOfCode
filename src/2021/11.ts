import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const printGrid = () => {
    world.forEach((row, i) => {
      let line = ''
      row.forEach((cell, j) => {
        if (world[i][j] === 0) line += clc.blue(world[i][j])
        else line += world[i][j]
      })
      log.info(line)
    })
  }

  const incrementLevel = (row: number, col: number) => {
    if (world[row][col] > 9) return
    world[row][col]++
    if (world[row][col] > 9) {
      if (row > 0 && col > 0) incrementLevel(row - 1, col - 1) // NW
      if (row > 0) incrementLevel(row - 1, col) // N
      if (row > 0 && col < world[row].length - 1) incrementLevel(row - 1, col + 1) // NE
      if (col > 0) incrementLevel(row, col - 1) // W
      if (col < world[row].length - 1) incrementLevel(row, col + 1) // E
      if (row < world.length - 1 && col > 0) incrementLevel(row + 1, col - 1) // SW
      if (row < world.length - 1) incrementLevel(row + 1, col) // S
      if (row < world.length - 1 && col < world[row].length - 1) incrementLevel(row + 1, col + 1) // SE
    }
  }

  let iterations = 0
  let totalFlashes = 0
  const world: World = []
  for await (const line of lineReader) world.push(line.split('').map(Number))

  while (part2 === 0) {
    for (let row of range(world.length)) for (let col of range(world[row].length)) incrementLevel(row, col)

    let partialFlashes = 0
    for (let row of range(world.length)) {
      for (let col of range(world[row].length)) {
        if (world[row][col] > 9) {
          partialFlashes++
          world[row][col] = 0
        }
      }
    }

    totalFlashes += partialFlashes
    if (++iterations === 100) part1 = totalFlashes
    if (partialFlashes === world.length * world[0].length) part2 = iterations
    if (params.ui?.show && params.ui?.during) printGrid()
  }
  return { part1, part2 }
}
