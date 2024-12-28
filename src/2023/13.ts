import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNumberOfDifferences = (s1: Array<string>, s2: Array<string>): number => s1.map((s, i) => (s === s2[i] ? 0 : 1)).reduce((a: number, b: number) => a + b, 0)

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

  const getMirrorScore = (world: World<string>, numberOfSmudges: number): number => {
    for (let i = 1; i < world.length; i++) {
      const oneHalf = world.slice(0, i).reverse()
      const otherHalf = world.slice(i, world.length)
      const smallestSide = Math.min(oneHalf.length, otherHalf.length)
      let numberOfDifferences = 0
      for (let j = 0; j < smallestSide; j++) {
        numberOfDifferences += getNumberOfDifferences(oneHalf[j], otherHalf[j])
      }
      if (numberOfDifferences === numberOfSmudges) {
        if (params.ui.show) {
          world.forEach((x: Array<string>, index) => {
            const inOneHalf = i - smallestSide <= index && index < i
            const inOtherHalf = i <= index && index < i + smallestSide
            if (inOneHalf) {
              console.log(clc.yellow(x.join('')))
            } else if (inOtherHalf) {
              console.log(clc.red(x.join('')))
            } else {
              console.log(x.join(''))
            }
          })
          console.log('\n')
        }
        return i
      }
    }
    return 0
  }

  const worlds: Array<World<string>> = []
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

  if (!params.skipPart1) {
    part1 = worlds.reduce((acc, world, index) => {
      const sumRows = getMirrorScore(world, 0)
      let sumColumns = 0
      if (sumRows === 0) sumColumns = getMirrorScore(rotate90(world), 0)
      return acc + sumRows * 100 + sumColumns
    }, 0)
  }

  if (!params.skipPart2) {
    part2 = worlds.reduce((acc, world, index) => {
      const sumRows = getMirrorScore(world, 1)
      let sumColumns = 0
      if (sumRows === 0) sumColumns = getMirrorScore(rotate90(world), 1)
      return acc + sumRows * 100 + sumColumns
    }, 0)
  }

  return { part1, part2 }
}
