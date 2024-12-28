import { Params } from 'aoc.d'
import { Point, PointPlus } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let worldSize = 1000
  let points: PointPlus[] = []
  const counts: Record<number, number> = {}
  const infinitePointIds: Set<number> = new Set()
  let index = 0

  for await (const line of lineReader) {
    const [x, y] = line.split(', ').map(Number)
    points.push([x, y, index++])
  }

  const getManhattan = (point1: PointPlus, point2: PointPlus) =>
    Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1])

  const getClosestPointIdAndTotalDistance = (thisPoint: PointPlus): [number | null, number] => {
    let closestPointId: number[] = []
    let closestPointDistance = 9999
    let totalDistance = 0
    points.forEach((point) => {
      let distance = getManhattan(thisPoint, point)
      totalDistance += distance
      if (distance < closestPointDistance) {
        closestPointDistance = distance
        closestPointId = [point[2]!]
      } else if (distance === closestPointDistance) {
        closestPointId.push(point[2]!)
      }
    })
    return [closestPointId.length === 1 ? closestPointId[0] : null, totalDistance]
  }

  for (var x = 0; x <= worldSize; x++) {
    for (var y = 0; y <= worldSize; y++) {
      let [id, totalDistance] = getClosestPointIdAndTotalDistance([x, y])
      if (totalDistance < params.threshold) part2++
      if (x === 0 || y === 0 || x === worldSize || y === worldSize) {
        if (id && !infinitePointIds.has(id)) infinitePointIds.add(id)
      } else {
        if (!!id) {
          if (!counts[id]) counts[+id] = 0
          counts[id]++
        }
      }
    }
  }

  let sortedPoints = Object.keys(counts)
    .filter((key) => !infinitePointIds.has(+key))
    .sort((a, b) => counts[+b] - counts[+a])
  part1 = counts[+sortedPoints[0]]

  return { part1, part2 }
}
