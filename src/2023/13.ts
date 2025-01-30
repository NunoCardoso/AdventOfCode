import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNumberOfDifferences = (s1: string[], s2: string[]): number =>
    s1.map((line, rowIndex) => (line === s2[rowIndex] ? 0 : 1)).reduce((a: number, b: number) => a + b, 0)

  const rotate90 = (world: World<string>): World<string> => {
    const newWorld: World<string> = Array(world[0].length)
      .fill(null)
      .map(() => [])
    for (let i = world.length - 1; i >= 0; i--) {
      for (let j = 0; j < world[0].length; j++) {
        newWorld[j].push(world[i][j])
      }
    }
    return newWorld
  }

  const print = (world: World<string>, smallestSide: number, rowIndex: number) => {
    world.forEach((row: string[], index) => {
      const inOneHalf = rowIndex - smallestSide <= index && index < rowIndex
      const inOtherHalf = rowIndex <= index && index < rowIndex + smallestSide
      if (inOneHalf) log.info(clc.yellow(row.join('')))
      else if (inOtherHalf) log.info(clc.red(row.join('')))
      else log.info(row.join(''))
    })
    log.info('\n')
  }

  const getMirrorScore = (world: World<string>, numberOfSmudges: number): number => {
    for (let row = 1; row < world.length; row++) {
      const oneHalf = world.slice(0, row).reverse()
      const otherHalf = world.slice(row, world.length)
      const smallestSide = Math.min(oneHalf.length, otherHalf.length)
      let numberOfDifferences = 0
      for (let lineIndex of range(smallestSide))
        numberOfDifferences += getNumberOfDifferences(oneHalf[lineIndex], otherHalf[lineIndex])
      if (numberOfDifferences === numberOfSmudges) {
        if (params.ui?.show) print(world, smallestSide, row)
        return row
      }
    }
    return 0
  }

  const solveFor = (worlds: World<string>[], numberOfSmudges: number) =>
    worlds.reduce((acc, world, index) => {
      const sumRows = getMirrorScore(world, numberOfSmudges)
      let sumColumns = sumRows === 0 ? getMirrorScore(rotate90(world), numberOfSmudges) : 0
      return acc + sumRows * 100 + sumColumns
    }, 0)

  const worlds: World<string>[] = []
  let currentWorld: World<string> = []
  for await (const line of lineReader) {
    if (line !== '') currentWorld.push(line.split(''))
    else {
      worlds.push(currentWorld)
      currentWorld = []
    }
  }
  // the leftover world
  worlds.push(currentWorld)

  if (!params.skipPart1) part1 = solveFor(worlds, 0)
  if (!params.skipPart2) part2 = solveFor(worlds, 1)

  return { part1, part2 }
}
