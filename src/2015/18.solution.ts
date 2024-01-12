import clc from 'cli-color'
import { Params } from 'aoc.d'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []
  for await (const line of lineReader) {
    world.push(line.split(''))
  }

  const printWorld = (world: World<string>, iteration: string | number) => {
    console.log('iteration', iteration)
    world.forEach((row) => {
      console.log(row.join('').replaceAll('#', clc.red('#')))
    })
  }

  const calculateNumberOfLights = (world: World<string>, x: number, y: number) => {
    let total: number = 0
    if (x > 0 && y > 0) total += world[x - 1][y - 1] === '#' ? 1 : 0
    if (x > 0) total += world[x - 1][y] === '#' ? 1 : 0
    if (x > 0 && y < world[0].length - 1) total += world[x - 1][y + 1] === '#' ? 1 : 0
    if (y > 0) total += world[x][y - 1] === '#' ? 1 : 0
    if (y < world[0].length - 1) total += world[x][y + 1] === '#' ? 1 : 0
    if (x < world.length - 1 && y > 0) total += world[x + 1][y - 1] === '#' ? 1 : 0
    if (x < world.length - 1) total += world[x + 1][y] === '#' ? 1 : 0
    if (x < world.length - 1 && y < world[0].length - 1) total += world[x + 1][y + 1] === '#' ? 1 : 0
    return total
  }

  const makeCornersOn = (world: World<string>) => {
    world[0][0] = '#'
    world[world.length - 1][0] = '#'
    world[0][world[0].length - 1] = '#'
    world[world.length - 1][world[0].length - 1] = '#'
  }

  const solveFor = (world: World<string>, limit: number, cornerStuck: boolean) => {
    if (cornerStuck) makeCornersOn(world)
    let iteration: number = 0
    while (iteration < limit) {
      world = world.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const numberOfLights = calculateNumberOfLights(world, rowIndex, columnIndex)
          return world[rowIndex][columnIndex] === '#'
            ? numberOfLights === 2 || numberOfLights === 3
              ? '#'
              : '.'
            : numberOfLights === 3
              ? '#'
              : '.'
        })
      )
      if (cornerStuck) makeCornersOn(world)
      if (params.ui?.show && params.ui?.during) printWorld(world, iteration)
      iteration++
    }
    if (params.ui?.show && params.ui?.end) printWorld(world, 'end')
    return world.reduce((acc, row) => acc + row.filter((cell) => cell === '#').length, 0)
  }

  if (!params.skipPart1) {
    part1 = solveFor(global.structuredClone(world), params.limit, false)
  }

  if (!params.skipPart2) {
    part2 = solveFor(global.structuredClone(world), params.limit, true)
  }

  return { part1, part2 }
}
