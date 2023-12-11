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

  const flipIt = (world: World<string>, limit: number, cornerStuck: boolean) => {
    let iteration: number = 0
    while (iteration < limit) {
      const _newWorld: World<string> = []
      for (let x = 0; x < world.length; x++) {
        const newRow: Array<string> = []
        for (let y = 0; y < world[x].length; y++) {
          const numberOfLights = calculateNumberOfLights(world, x, y)
          if (world[x][y] === '#') {
            newRow.push(numberOfLights === 2 || numberOfLights === 3 ? '#' : '.')
          } else {
            newRow.push(numberOfLights === 3 ? '#' : '.')
          }
        }
        _newWorld.push(newRow)
      }
      world = _newWorld
      if (cornerStuck) {
        makeCornersOn(world)
      }
      if (params.ui?.show && params.ui?.during) {
        printWorld(world, iteration)
      }
      iteration++
    }

    if (params.ui?.show && params.ui?.end) {
      printWorld(world, 'end')
    }
    return world
  }

  const limit = params.limit

  if (params.skip !== true && params.skip !== 'part1') {
    let world1 = global.structuredClone(world)
    world1 = flipIt(world1, limit, false)
    part1 = world1.reduce((acc, row) => acc + row.filter((cell) => cell === '#').length, 0)
  }

  if (params.skip !== true && params.skip !== 'part2') {
    let world2 = global.structuredClone(world)
    makeCornersOn(world2)
    world2 = flipIt(world2, limit, true)
    part2 = world2.reduce((acc, row) => acc + row.filter((cell) => cell === '#').length, 0)
  }

  return { part1, part2 }
}
