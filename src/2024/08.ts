import { Params } from 'aoc.d'
import { Dimension, Point } from 'declarations'
import { Permutation } from 'js-combinatorics'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let antennaPositions: Record<string, Point[]> = {}
  let row = 0
  let dimension: Dimension = [0, 0]
  for await (const line of lineReader) {
    const values = line.split('')
    if (dimension[0] === 0) dimension[0] = values.length
    values.forEach((val: string, col: number) => {
      if (val !== '.') {
        if (!antennaPositions[val]) antennaPositions[val] = []
        antennaPositions[val].push([row, col])
      }
    })
    row++
  }
  dimension[1] = row

  const point2string = (p: Point): string => p[0] + ',' + p[1]

  const solveFor = (part: string): number => {
    let uniquePoints: Set<string> = new Set()
    Object.keys(antennaPositions).forEach((key) => {
      new Permutation(antennaPositions[key], 2).toArray().forEach((pair) => {
        let deltaRow = pair[1][0] - pair[0][0]
        let deltaCol = pair[1][1] - pair[0][1]
        if (part === 'part1') {
          let newPoint: Point = [pair[1][0] + deltaRow, pair[1][1] + deltaCol]
          if (
            newPoint[0] >= 0 &&
            newPoint[0] < dimension[0] &&
            newPoint[1] >= 0 &&
            newPoint[1] < dimension[1]
          ) {
            uniquePoints.add(point2string(newPoint))
          }
        }
        if (part === 'part2') {
          let anchorPoint: Point | undefined = pair[0]
          while (anchorPoint !== undefined) {
            let newPoint: Point = [anchorPoint[0] + deltaRow, anchorPoint[1] + deltaCol]
            if (
              newPoint[0] >= 0 &&
              newPoint[0] < dimension[0] &&
              newPoint[1] >= 0 &&
              newPoint[1] < dimension[1]
            ) {
              uniquePoints.add(point2string(newPoint))
              anchorPoint = newPoint
            } else {
              anchorPoint = undefined
            }
          }
        }
      })
    })
    return uniquePoints.size
  }

  if (!params.skipPart1) {
    part1 = solveFor('part1')
  }
  if (!params.skipPart2) {
    part2 = solveFor('part2')
  }

  return { part1, part2 }
}
