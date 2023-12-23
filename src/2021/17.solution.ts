import { Params } from 'aoc.d'
import { Point } from 'declarations'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const start: Point = [0, 0]
  const end1: Point = [0, 0]
  const end2: Point = [0, 0]

  const inTarget = (p: Point) => {
    return p[0] >= end1[0] && p[0] <= end2[0] && p[1] <= end1[1] && p[1] >= end2[1]
  }

  const isOvershot = (p: Point, speed: Point) => {
    return (
      !inTarget(p) &&
      // overshot on x and y
      (p[0] > end2[0] ||
        p[1] < end2[1] ||
        // low x but with no speed to reach target
        (p[0] < end1[0] && speed[0] === 0))
    )
  }

  for await (const line of lineReader) {
    const values = line.match(/target area: x=(\d+)..(\d+), y=-(\d+)..-(\d+)/)
    end1[0] = parseInt(values[1])
    end2[0] = parseInt(values[2])
    end2[1] = -1 * parseInt(values[3])
    end1[1] = -1 * parseInt(values[4])
    log.info('end1', end1, 'end2', end2)
  }

  const simulate = (speed: Point): number | undefined => {
    const currentPoint = [start[0], start[1]] as Point
    const currentSpeed = [speed[0], speed[1]] as Point
    let highestY = 0
    let it = 0

    let status
    while (!status) {
      currentPoint[0] = currentPoint[0] + currentSpeed[0]
      currentPoint[1] = currentPoint[1] + currentSpeed[1]
      currentSpeed[0] =
        currentSpeed[0] === 0 ? 0 : currentSpeed[0] > 0 ? currentSpeed[0] - 1 : currentSpeed[0] + 1
      currentSpeed[1]--
      if (currentPoint[1] > highestY) {
        log.debug('it', it, 'highestY', currentPoint[1])
        highestY = currentPoint[1]
      }
      if (inTarget(currentPoint)) {
        log.debug('it', it, 'in target')
        status = 'inTarget'
      }
      if (isOvershot(currentPoint, currentSpeed)) {
        log.debug('it', it, 'overshoot')
        status = 'overshot'
      }
      it++
    }
    if (status === 'inTarget') {
      return highestY
    }
    return undefined
  }

  // limit values could be better
  for (let x = 2; x < 1000; x++) {
    for (let y = -500; y < 5000; y++) {
      const highestY: number | undefined = simulate([x, y])
      if (_.isNumber(highestY)) {
        if (part1 < highestY) {
          part1 = highestY
        }
        part2++
      }
    }
  }

  return { part1, part2 }
}
