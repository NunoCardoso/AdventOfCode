import { Params } from 'aoc.d'
import { Location } from 'declarations'
import { getKey } from 'util/location'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNextPoint = (direction: string, location: Location): Location => {
    if (direction === '>') return [location[0] + 1, location[1]]
    if (direction === '^') return [location[0], location[1] - 1]
    if (direction === '<') return [location[0] - 1, location[1]]
    return [location[0], location[1] + 1] // if (d === 'v')
  }

  let lowerRightCorner = 1
  let radius = 1
  while (lowerRightCorner < params.value) {
    radius++
    lowerRightCorner = (radius * 2 - 1) * (radius * 2 - 1)
  }
  // the outer square is 4 sides of (radius - 1)
  // find the side, then the distance is (radius - 1) plus distance from center
  let lowerOtherCorner = lowerRightCorner
  while (lowerOtherCorner > params.value) lowerOtherCorner -= (radius - 1) * 2
  const diff = Math.abs(lowerOtherCorner + (radius - 1) - params.value)
  part1 = radius - 1 + diff
  log.debug('val', params.value, 'r', radius, 'd', part1, 'low', lowerOtherCorner, 'high', lowerRightCorner)

  const memory: Map<string, number> = new Map()
  let direction = 'v'
  const nextDirection: Record<string, string> = { '>': '^', '^': '<', '<': 'v', v: '>' }
  let point: Point = [0, 0]
  let value = 1
  memory.set('0,0', value)
  while (value < params.value) {
    let nextPoint = getNextPoint(nextDirection[direction], point)
    if (memory.has(getKey(nextPoint))) nextPoint = getNextPoint(direction, point)
    else direction = nextDirection[direction]
    let sum = 0
    for (let x = nextPoint[0] - 1; x <= nextPoint[0] + 1; x++) {
      for (let y = nextPoint[1] - 1; y <= nextPoint[1] + 1; y++) {
        const key = getKey([x, y])
        if (memory.has(key)) sum += memory.get(key)!
      }
    }
    value = sum
    point = nextPoint
    memory.set(getKey(point), value)
  }
  part2 = value

  return { part1, part2 }
}
