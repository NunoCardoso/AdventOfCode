import { Params } from 'aoc.d'
import { Dimension, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []
  let dimension: Dimension = [0, 0]
  for await (const line of lineReader) {
    world.push(line.split(''))
    if (dimension[1] === 0) dimension[1] = line.length
    dimension[0]++
  }

  const isToiletPaper = (value: string): number => (value === '@' ? 1 : 0)

  const collectToiletPapers = (row: number, col: number): boolean => {
    let amount = 0
    if (row > 0) {
      if (col > 0) amount += isToiletPaper(world[row - 1][col - 1])
      amount += isToiletPaper(world[row - 1][col])
      if (col + 1 < dimension[1]) amount += isToiletPaper(world[row - 1][col + 1])
    }
    if (col > 0) amount += isToiletPaper(world[row][col - 1])
    if (col + 1 < dimension[1]) amount += isToiletPaper(world[row][col + 1])
    if (row + 1 < dimension[0]) {
      if (col > 0) amount += isToiletPaper(world[row + 1][col - 1])
      amount += isToiletPaper(world[row + 1][col])
      if (col + 1 < dimension[1]) amount += isToiletPaper(world[row + 1][col + 1])
    }
    return amount < 4
  }

  const solveForPart1 = (): number => {
    let res = 0
    world.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (world[rowIndex][colIndex] === '@') {
          res += collectToiletPapers(rowIndex, colIndex) ? 1 : 0
        }
      })
    })
    return res
  }

  const solveForPart2 = () => {
    let collectedRollsOfPaper = 0
    let lastCollectedRollsOfPaper = 0
    do {
      lastCollectedRollsOfPaper = collectedRollsOfPaper
      let markForRemoval: [number, number][] = []
      world.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (world[rowIndex][colIndex] === '@') {
            if (collectToiletPapers(rowIndex, colIndex)) {
              markForRemoval.push([rowIndex, colIndex])
            }
          }
        })
      })
      collectedRollsOfPaper += markForRemoval.length
      markForRemoval.forEach((coord) => (world[coord[0]][coord[1]] = '.'))
    } while (collectedRollsOfPaper !== lastCollectedRollsOfPaper)
    return collectedRollsOfPaper
  }

  if (!params.skipPart1) part1 = solveForPart1()
  if (!params.skipPart2) part2 = solveForPart2()

  return { part1, part2 }
}
