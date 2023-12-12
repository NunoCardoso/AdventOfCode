import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getDifferences = (s1: Array<string>, s2: Array<string>): number =>
    s1.map((s, i) => (s === s2[i] ? 0 : 1)).reduce((a: number, b: number) => a + b, 0)

  const transpose = (world: World<string>): World<string> => {
    const _w: World<string> = Array(world[0].length)
      .fill(null)
      .map(() => [])
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[0].length; j++) {
        _w[j].push(world[i][j])
      }
    }
    return _w.map((x) => x.reverse())
  }

  const getIt = (world: World<string>, errors: number): number => {
    for (let i = 1; i < world.length; i++) {
      // log.debug('trying',i)
      const oneHalf = world.slice(0, i).reverse()
      const otherHalf = world.slice(i, world.length)

      let numberOfDifferences = 0
      const smallestSide = Math.min(oneHalf.length, otherHalf.length)
      for (let j = 0; j < smallestSide; j++) {
        numberOfDifferences += getDifferences(oneHalf[j], otherHalf[j])
      }
      if (numberOfDifferences === errors) {
        // console.log('smallestSide', smallestSide,'i',i)
        if (params.ui.show) {
          world.forEach((x: Array<string>, index) => {
            const inOneHalf = i - smallestSide <= index && index < i
            const inOtherHalf = i <= index && index < i + smallestSide
            // console.log('index', index,'inOneHalf', inOneHalf,'inOtherHalf',inOtherHalf)

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

  const solveFor = (worlds: Array<World<string>>, errors: number): number => {
    let sum = 0
    worlds.forEach((world, index) => {
      const sumRows = getIt(world, errors) * 100
      sum += sumRows
      if (sumRows === 0) {
        const sumColumns = getIt(transpose(world), errors)
        sum += sumColumns
      }
    })
    return sum
  }

  const worlds: Array<World<string>> = []
  let currentWorld: World<string> = []
  for await (const line of lineReader) {
    if (line !== '') {
      currentWorld.push(line.split(''))
    } else {
      worlds.push(global.structuredClone(currentWorld))
      currentWorld = []
    }
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = solveFor(worlds, 0)
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = solveFor(worlds, 1)
  }

  return { part1, part2 }
}
