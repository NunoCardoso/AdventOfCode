import { Params } from 'aoc.d'
import { Location, LocationPlus } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const areas: Record<number, number> = {}
  const infiniteLocationIds: Set<number> = new Set()

  const getManhattan = (location1: Location | LocationPlus, location2: LocationPlus) =>
    Math.abs(location1[0] - location2[0]) + Math.abs(location1[1] - location2[1])

  const getClosestLocationIdAndTotalDistance = (thisLocation: Location | LocationPlus): [number | null, number] => {
    let closestLocationId: number[] = []
    let closestLocationDistance = Number.MAX_VALUE
    let totalDistance = locations.reduce((acc, location) => {
      let distance = getManhattan(thisLocation, location)
      if (distance < closestLocationDistance) {
        closestLocationDistance = distance
        closestLocationId = [location[2]!]
      } else if (distance === closestLocationDistance) {
        closestLocationId.push(location[2]!)
      }
      return acc + distance
    }, 0)
    return [closestLocationId.length === 1 ? closestLocationId[0] : null, totalDistance]
  }

  let index = 0
  let locations: LocationPlus[] = []
  let worldSize = 0
  for await (const line of lineReader) {
    const [x, y] = line.split(', ').map(Number)
    locations.push([x, y, index++])
    if (x > worldSize) worldSize = x
    if (y > worldSize) worldSize = y
  }

  for (var x = 0; x <= worldSize; x++) {
    for (var y = 0; y <= worldSize; y++) {
      let [id, totalDistance] = getClosestLocationIdAndTotalDistance([x, y])
      if (totalDistance < params.threshold) part2++
      if (id) {
        if (x === 0 || y === 0 || x === worldSize || y === worldSize) infiniteLocationIds.add(id)
        else areas[id] = (areas[id] ?? 0) + 1
      }
    }
  }

  let sortedLocations = Object.keys(areas)
    .filter((key) => !infiniteLocationIds.has(+key))
    .sort((a, b) => areas[+b] - areas[+a])
  part1 = areas[+sortedLocations[0]]

  return { part1, part2 }
}
