import { Params } from 'aoc.d'
import { Location } from 'declarations'
import { getKey } from 'util/location'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNextLocation = (direction: string, location: Location): Location => {
    if (direction === '>') return [location[0] + 1, location[1]]
    if (direction === '^') return [location[0], location[1] - 1]
    if (direction === '<') return [location[0] - 1, location[1]]
    return [location[0], location[1] + 1] // if (d === 'v')
  }

  const solvePart1 = () => {
    let lowerRightCorner = 1
    let radius = 1
    while (lowerRightCorner < params.value) {
      radius++
      lowerRightCorner = (radius * 2 - 1) * (radius * 2 - 1)
    }

    let previousCorner = lowerRightCorner
    while (previousCorner > params.value) previousCorner -= 2 * (radius - 1)
    const distanceToCenterOfSquareSide = Math.abs(previousCorner + (radius - 1) - params.value)
    return radius - 1 + distanceToCenterOfSquareSide
  }

  const solvePart2 = () => {
    const memory: Map<string, number> = new Map()
    let direction = 'v'
    const nextDirection: Record<string, string> = { '>': '^', '^': '<', '<': 'v', v: '>' }
    let location: Location = [0, 0]
    let value = 1
    memory.set(getKey(location), value)

    while (value < params.value) {
      let nextLocation = getNextLocation(nextDirection[direction], location)
      if (memory.has(getKey(nextLocation))) nextLocation = getNextLocation(direction, location)
      else direction = nextDirection[direction]
      value = 0
      for (let x of range(3, nextLocation[0] - 1)) {
        for (let y of range(3, nextLocation[1] - 1)) {
          const key = getKey([x, y])
          if (memory.has(key)) value += memory.get(key)!
        }
      }
      memory.set(getKey(nextLocation), value)
      location = nextLocation
    }
    return value
  }

  part1 = solvePart1()
  part2 = solvePart2()
  return { part1, part2 }
}
