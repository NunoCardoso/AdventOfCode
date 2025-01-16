import { Params } from 'aoc.d'
import { BoundingBox, Location } from 'declarations'

type Speed = [number, number]
type Status = 'ongoing' | 'inTarget' | 'overshot'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const inTarget = (p: Location, target: BoundingBox) =>
    p[0] >= target[0][0] && p[0] <= target[1][0] && p[1] <= target[0][1] && p[1] >= target[1][1]

  const isOvershot = (p: Location, speed: Location, target: BoundingBox) =>
    !inTarget(p, target) &&
    // overshot on x and y
    (p[0] > target[1][0] ||
      p[1] < target[1][1] ||
      // low x but with no speed to reach target
      (p[0] < target[0][0] && speed[0] === 0))

  const shoot = (initialStart: Location, initialSpeed: Speed, target: BoundingBox): number | undefined => {
    const location: Location = [...initialStart]
    const speed: Speed = [...initialSpeed]
    let highestY = 0
    let iterations = 0

    let status: Status = 'ongoing'
    while (status === 'ongoing') {
      location[0] += speed[0]
      location[1] += speed[1]
      speed[0] = speed[0] === 0 ? 0 : speed[0] > 0 ? speed[0] - 1 : speed[0] + 1
      speed[1]--
      if (location[1] > highestY) highestY = location[1]
      if (inTarget(location, target)) {
        log.debug('it', iterations, 'in target')
        status = 'inTarget'
      } else if (isOvershot(location, speed, target)) {
        log.debug('it', iterations, 'overshoot')
        status = 'overshot'
      }
      iterations++
    }
    if (status === 'inTarget') return highestY
    return undefined
  }

  const start: Location = [0, 0]
  let target: BoundingBox = [
    [0, 0],
    [0, 0]
  ]

  for await (const line of lineReader) {
    const [, x1, x2, y1, y2] = line.match(/target area: x=(.+)\.\.(.+), y=(.+)\.\.(.+)/).map(Number)
    target = [
      [x1, y2],
      [x2, y1]
    ]
  }

  // limit values could be better
  for (let xSpeed = 2; xSpeed < 1000; xSpeed++) {
    for (let ySpeed = -500; ySpeed < 5000; ySpeed++) {
      const highestY: number | undefined = shoot(start, [xSpeed, ySpeed], target)
      if (highestY !== undefined) {
        if (part1 < highestY) part1 = highestY
        part2++
      }
    }
  }

  return { part1, part2 }
}
