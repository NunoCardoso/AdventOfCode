import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []
  let start: string = ''
  let i = 0
  for await (const line of lineReader) {
    if (line.indexOf('S') >= 0) start = i + ',' + line.indexOf('S')
    world.push(line.split(''))
    i++
  }
  const worldDimensions = [world.length, world[0].length]

  const insideBounds = (p: Point): boolean =>
    p[0] >= 0 && p[0] < worldDimensions[0] && p[1] >= 0 && p[1] < worldDimensions[1]

  const hitsWall = (p: Point) => world[p[0]][p[1]] === '#'

  const readKey = (s: string): Point => s.split(',').map(Number) as Point

  const getNewPoints = (point: string): Array<Point> => {
    const p = readKey(point)
    const newHeads: Array<Point> = [
      [p[0] - 1, p[1]],
      [p[0] + 1, p[1]],
      [p[0], p[1] - 1],
      [p[0], p[1] + 1]
    ] as Array<Point>
    return newHeads.filter((newPoint: Point) => insideBounds(newPoint) && !hitsWall(newPoint))
  }

  const doWalk = (opened: Set<string>): Set<string> => {
    const newOpened: Set<string> = new Set()
    opened.forEach((value, key) => {
      const newHeadsPlus: Array<Point> = getNewPoints(key)
      // let's start with the ones who stay in the map first
      // pick the one that is the max
      newHeadsPlus.forEach((p: Point) => {
        const pointKey: string = p[0] + ',' + p[1]
        newOpened.add(p[0] + ',' + p[1])
      })
    })
    return newOpened
  }

  const solveFor = (start: string, maxSteps: number) => {
    let opened: Set<string> = new Set()
    opened.add(start)
    let i = 0
    while (i < maxSteps) {
      opened = doWalk(opened)
      i++
    }
    return opened
  }

  if (!params.skipPart1) {
    part1 = solveFor(start, params.steps.part1).size
  }

  const withinDistance = (i: number, j: number, start: Point, range: number) =>
    Math.abs(i - start[0]) + Math.abs(j - start[1]) <= range

  const generatePaths = (world: World<string>, start: Point, tiles: 'odd' | 'even', range: number): number => {
    let count = 0
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[i].length; j++) {
        if (world[i][j] !== '#' && withinDistance(i, j, start, range)) {
          const isEven = (i + j) % 2 === 0
          count += isEven ? (tiles === 'even' ? 1 : 0) : tiles === 'odd' ? 1 : 0
        }
      }
    }
    return count
  }

  const generatePathList = (
    world: World<string>,
    start: Point,
    tiles: 'odd' | 'even',
    range: number
  ): Array<string> => {
    const list: Array<string> = []
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[i].length; j++) {
        if (world[i][j] !== '#' && withinDistance(i, j, start, range)) {
          const isEven = (i + j) % 2 === 0
          if (isEven && tiles === 'even') {
            list.push(i + ',' + j)
          }
          if (!isEven && tiles === 'odd') {
            list.push(i + ',' + j)
          }
        }
      }
    }
    return list
  }

  const printGrid = (world: World<string>, list: Set<string>) => {
    world.forEach((row: Array<string>, i: number) => {
      let l = ''
      row.forEach((cell: string, j: number) => {
        if (list.has(i + ',' + j)) {
          l += clc.green('O')
        } else {
          if (world[i][j] === '#') {
            l += clc.red(world[i][j])
          } else {
            l += world[i][j]
          }
        }
      })
      console.log(l)
    })
  }

  if (!params.skipPart2) {
    const startPoint = readKey(start)
    // C is like O, but with the start
    const halfway = (world[0].length - 1) / 2
    const fullway = world.length - 1

    const repetitions = (params.steps.part2 - halfway) / world.length
    console.log('halfway', halfway, 'fullway', fullway, 'repetitions', repetitions)

    // map has 1976 #, total 17161 squares, 15185 empty slots

    const gardenB = solveFor(halfway + ',' + (halfway - 1), fullway * 2).size
    const gardenC = solveFor(halfway + ',' + halfway, fullway * 2).size
    const gardenO = gardenC - 1
    const gardenN = solveFor(fullway + ',' + halfway, fullway).size
    const gardenW = solveFor(halfway + ',' + fullway, fullway).size
    const gardenE = solveFor(halfway + ',' + 0, fullway).size
    const gardenS = solveFor(0 + ',' + halfway, fullway).size
    const gardenLS_NE = solveFor(fullway + ',' + 0, halfway).size
    const gardenLS_NW = solveFor(fullway + ',' + fullway, halfway).size
    const gardenLS_SW = solveFor(0 + ',' + fullway, halfway).size
    const gardenLS_SE = solveFor(0 + ',' + 0, halfway).size
    const gardenBS_NE = solveFor(fullway + ',' + 0, fullway + halfway).size
    const gardenBS_NW = solveFor(fullway + ',' + fullway, fullway + halfway).size
    const gardenBS_SW = solveFor(0 + ',' + fullway, fullway + halfway).size
    const gardenBS_SE = solveFor(0 + ',' + 0, fullway + halfway).size
    /* console.log('gardenN + gardenLS_SE + gardenLS_SW',gardenN + gardenLS_SE + gardenLS_SW, gardenC)
    console.log('gardenS + gardenLS_NE + gardenLS_NW',gardenS + gardenLS_NE + gardenLS_NW, gardenC)
    console.log('gardenW + gardenLS_NE + gardenLS_SE',gardenW + gardenLS_NE + gardenLS_SE, gardenC)
    console.log('gardenE + gardenLS_NW + gardenLS_SW',gardenE + gardenLS_NW + gardenLS_SW, gardenC)
    console.log('gardenBS_NE + gardenLS_SW',gardenBS_NE + gardenLS_SW, gardenC)
    console.log('gardenBS_NW + gardenLS_SE',gardenBS_NW + gardenLS_SE, gardenC)
    console.log('gardenBS_SE + gardenLS_NW',gardenBS_SE + gardenLS_NW, gardenC)
    console.log('gardenBS_SW + gardenLS_NE',gardenBS_SW + gardenLS_NE, gardenC)
*/

    part2 = gardenO + gardenN + gardenW + gardenE + gardenS
    // B: 202300 * 202300
    part2 += gardenB * repetitions * repetitions
    // C: 202298 * 202298
    part2 += gardenC * (repetitions - 2) * (repetitions - 2)
    // LS
    part2 += repetitions * (gardenLS_NE + gardenLS_NW + gardenLS_SW + gardenLS_SE)
    // BS
    part2 += (repetitions - 1) * (gardenBS_NE + gardenBS_NW + gardenBS_SW + gardenBS_SE)
  }

  // 621447496611690 too high
  // 621447469908090 too high
  // 621447443609230 too high
  // 621447443605472 not right
  // 621447435213965 not right
  // 621289922886149 right

  return { part1, part2 }
}
