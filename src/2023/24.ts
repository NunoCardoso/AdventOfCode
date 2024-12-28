import { Params } from 'aoc.d'

type Position = { x: number; y: number; z: number }
type Speed = { x: number; y: number; z: number }
type Hailstone = {
  position: Position
  speed: Speed
}
type SortZData = {
  hailstormIndex: number
  time: number
  position: number
  speed: number
}
type Opened = {
  sorted: Array<SortZData>
  left: Array<SortZData>
  going: 'up' | 'down'
}
type Data = { best: Array<SortZData> }
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const hailstones: Array<Hailstone> = []
  const sortZData: Array<SortZData> = []

  for await (const line of lineReader) {
    const [left, right] = line.split(' @ ')
    const p = left.split(', ').map(Number)
    const s = right.split(', ').map(Number)
    hailstones.push({
      position: { x: p[0], y: p[1], z: p[2] },
      speed: { x: s[0], y: s[1], z: s[2] }
    })
  }

  const doCollide = (h1: Hailstone, h2: Hailstone): boolean => {
    // y = mx + b
    const slope1m = (h1.speed.y * 1.0) / (h1.speed.x * 1.0)

    const slope1b = h1.position.y * 1.0 - h1.position.x * 1.0 * slope1m
    const slope2m = (h2.speed.y * 1.0) / (h2.speed.x * 1.0)
    const slope2b = h2.position.y * 1.0 - h2.position.x * 1.0 * slope2m
    // log.debug('h1',h1,'h2',h2,'m1',slope1m, 'b1',slope1b, 'm2', slope2m, '2b', slope2b)
    if (Math.abs(slope1m - slope2m) < 0.000001) {
      log.debug('parallel')
      return false
    }
    const interseptX = (slope1b - slope2b) / ((h2.speed.y * 1.0) / (h2.speed.x * 1.0) - slope1m)
    const interseptY = interseptX * ((h1.speed.y * 1.0) / (h1.speed.x * 1.0)) + slope1b
    const interseptY2 = interseptX * ((h2.speed.y * 1.0) / (h2.speed.x * 1.0)) + slope2b
    if (Math.abs(interseptY2 - interseptY) > 1) {
      log.debug('something is wrong', interseptY2, interseptY)
      //  return false
    }
    // log.debug('interseptX', interseptX, 'interseptY', interseptY)
    if (interseptX >= params.from && interseptX <= params.to && interseptY >= params.from && interseptY <= params.to) {
      if (
        (h1.speed.x > 0 ? interseptX - h1.position.x > 0 : interseptX - h1.position.x < 0) &&
        (h2.speed.x > 0 ? interseptX - h2.position.x > 0 : interseptX - h2.position.x < 0) &&
        (h1.speed.y > 0 ? interseptY - h1.position.y > 0 : interseptY - h1.position.y < 0) &&
        (h2.speed.y > 0 ? interseptY - h2.position.y > 0 : interseptY - h2.position.y < 0)
      ) {
        log.debug('interseptX', interseptX, 'interseptY2', interseptY2, 'true')
        return true
      } else {
        log.debug('interseptX', interseptX, 'interseptY2', interseptY2, 'false, collision in past')
        log.debug('h1.x', h1.position.x, 'h1.m', slope1m, 'h2.x', h2.position.x, 'h2.m', slope2m)
        return false
      }
    }
    log.debug('interseptX', interseptX, 'interseptY2', interseptY2, 'false, collision outside box')
    return false
  }

  const areAligned = (hailstones: Array<Hailstone>, i: number, j: number) => {
    const length = hailstones.length
    const h1 = hailstones[i]
    const h2 = hailstones[j]
    const diffX1 = h2.position.x + (length - 1) * h2.speed.x - Math.abs(h1.position.x)
    const diffY1 = h2.position.y + (length - 1) * h2.speed.y - Math.abs(h1.position.y)
    const diffZ1 = h2.position.z + (length - 1) * h2.speed.z - Math.abs(h1.position.z)

    // if these two are the edges, then the remaining length -1 hailstones should fit between,
    // with an integer value in all axis
    for (let k = 0; k < hailstones.length; k++) {
      if (k !== i && k !== j) {
      }
    }
    if (s) {
      if (Number.isInteger(diffX1 / (length - 1)) && Number.isInteger(diffY1 / (length - 1)) && Number.isInteger(diffZ1 / (length - 1))) {
        console.log('Got h1', h1, 'h2', h2, 'diffX1', diffX1, 'diffY1', diffY1, 'diffZ1', diffZ1, 'length', length)
        return h1
      }
    }
    const diffX2 = h1.position.x + (length - 1) * h1.speed.x - Math.abs(h2.position.x)
    const diffY2 = h1.position.y + (length - 1) * h1.speed.y - Math.abs(h2.position.y)
    const diffZ2 = h1.position.z + (length - 1) * h1.speed.z - Math.abs(h2.position.z)
    if (Number.isInteger(diffX2 / (length - 1)) && Number.isInteger(diffY2 / (length - 1)) && Number.isInteger(diffZ2 / (length - 1))) {
      console.log('Got h2', h2, 'h1', h1, 'diffX2', diffX2, 'diffY2', diffY2, 'diffZ2', diffZ2, 'length', length)
      return h2
    }
    return undefined
  }

  for (let i = 0; i < hailstones.length - 1; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      if (!params.skipPart1 && doCollide(hailstones[i], hailstones[j])) {
        part1++
      }
      const h: Hailstone | undefined = areAligned(hailstones, i, j)
      if (h) {
        part2 = h.position.x + h.position.y + h.position.z
      }
    }
  }

  return { part1, part2 }
}
