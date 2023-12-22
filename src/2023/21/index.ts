import { Params } from 'aoc.d'
import { Point, World } from 'declarations'

type PointPlus = [number, number, boolean]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []
  let start: string = ''
  let i = 0
  for await (const line of lineReader) {
    if (line.indexOf('S') >= 0) start = i + ',' + line.indexOf('S')
    world.push(line.split(''))
    i++
  }
  let worldDimensions = [world.length, world[0].length]

  const outOfBounds = (p: Point): boolean =>
    p[0] < 0 || p[0] >= worldDimensions[0] || p[1] < 0 || p[1] >= worldDimensions[1]

  const jumpInMap = (p: Point): PointPlus => {
    return [
      ((p[0] + worldDimensions[0]) % worldDimensions[0]),
      ((p[1] + worldDimensions[1]) % worldDimensions[1]),
      outOfBounds(p)
    ]
  }

  const hitsWall = (p: PointPlus) => world[p[0]][p[1]] === '#'

  const readKey = (s: string): Point => s.split(',').map(Number) as Point

  const getNewPoints = (point: string): Array<PointPlus> => {
    let p = readKey(point)
    let newHeads: Array<Point> = ([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0], p[1] - 1], [p[0], p[1] + 1]] as Array<Point>)
    let newHeadsPlus: Array<PointPlus>= newHeads.map(jumpInMap).filter((newPoint: PointPlus) => !hitsWall(newPoint))
    return newHeadsPlus
  }

  const doWalk = (opened: Map<string, number>): Map<string, number> => {
    let newOpened: Map<string, number> = new Map<string, number>()
    opened.forEach((value, key) => {

      let newHeadsPlus: Array<PointPlus>= getNewPoints(key)
      // let's start with the ones who stay in the map first
      // pick the one that is the max
      newHeadsPlus.filter(h => h[2] === false).forEach((p: PointPlus) => {
        let pointKey: string = p[0] + ',' + p[1]
        !newOpened.has(pointKey)
           ? newOpened.set(pointKey, value)
           : newOpened.set(pointKey, Math.max(newOpened.get(pointKey)!, value))
      })
      newHeadsPlus.filter(h => h[2] === true).forEach((p: PointPlus) => {
        let key = p[0] + ',' + p[1]
        !newOpened.has(key)
           ? newOpened.set(key, value)
           : newOpened.set(key, newOpened.get(key) !+ value)
      })
    })

    return newOpened
  }

  if (!params.skipPart1) {
    let opened: Map<string,number> = new Map()
    opened.set(start, 1)
    let i = 0
    while (i < params.steps.part1) {
      log.debug('i',i)
      opened = doWalk(opened)
      i++
    }
    opened.forEach((value, key) => part1 += value)
  }

  if (!params.skipPart2) {
    let opened: Map<string,number> = new Map()
    opened.set(start, 1)
    let i = 0
    while (i < params.steps.part2) {
      opened = doWalk(opened)
      console.log('i',i)
      console.log(opened)
      i++
    }
    console.log(opened.size)
    opened.forEach((value, key) => part2 += value)
  }

  return { part1, part2 }
}
