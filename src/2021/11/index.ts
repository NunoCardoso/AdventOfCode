import clc from 'cli-color'
import { Params } from 'aoc.d'
import { Matrix } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: Matrix = []

  for await (const line of lineReader) {
    world.push(line.split('').map(Number))
  }

  let iterations = 0
  let flashes = 0

  const printGrid = () => {
    world.forEach((row, i) => {
      let line = ''
      row.forEach((cell, j) => {
        if (world[i][j] === 0) {
          line += clc.blue(world[i][j])
        } else {
          line += world[i][j]
        }
      })
      console.log(line)
    })
  }

  const incrementLevel = (row: number, col: number) => {
    if (world[row][col] > 9) {
      return
    }
    world[row][col]++
    if (world[row][col] > 9) {
      // NW
      if (row > 0 && col > 0) {
        incrementLevel(row - 1, col - 1)
      }
      // N
      if (row > 0) {
        incrementLevel(row - 1, col)
      }
      // NE
      if (row > 0 && col < world[row].length - 1) {
        incrementLevel(row - 1, col + 1)
      }
      // W
      if (col > 0) {
        incrementLevel(row, col - 1)
      }
      // E
      if (col < world[row].length - 1) {
        incrementLevel(row, col + 1)
      }

      // SW
      if (row < world.length - 1 && col > 0) {
        incrementLevel(row + 1, col - 1)
      }
      // S
      if (row < world.length - 1) {
        incrementLevel(row + 1, col)
      }
      // AE
      if (row < world.length - 1 && col < world[row].length - 1) {
        incrementLevel(row + 1, col + 1)
      }
    }
  }

  let allFlashed = false

  while (!allFlashed) {
    for (let row = 0; row < world.length; row++) {
      for (let col = 0; col < world[row].length; col++) {
        incrementLevel(row, col)
      }
    }

    let partialFlashes = 0
    for (let row = 0; row < world.length; row++) {
      for (let col = 0; col < world[row].length; col++) {
        if (world[row][col] > 9) {
          partialFlashes++
          world[row][col] = 0
        }
      }
    }
    flashes += partialFlashes
    iterations++

    if (iterations === 100) {
      part1 = flashes
    }

    if (partialFlashes === world.length * world[0].length) {
      part2 = iterations
      allFlashed = true
    }

    if (params.ui?.show && params.ui?.during) {
      log.debug('After step', iterations, 'flashes', flashes)
      printGrid()
    }
  }
  return { part1, part2 }
}
