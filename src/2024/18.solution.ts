import { Params } from 'aoc.d'
import { Dimension, Point, PointPlus, World } from 'declarations'

type Data = {
  end: Point
  size: Dimension
  lowestScore: number
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let bytes: Point[] = []
  for await (const line of lineReader) bytes.push(line.split(',').map(Number) as Point)

  const isSame = (p: PointPlus, p2: Point | PointPlus): boolean => p[0] === p2[0] && p[1] === p2[1]

  const getManhattanDistance = (p: PointPlus, b: Point) => Math.abs(b[0] - p[0]) + Math.abs(b[1] - p[1])

  const getNewPoints = (head: PointPlus, size: Dimension, bytes: Point[]): PointPlus[] => {
    return (
      [
        [head[0] - 1, head[1], head[2]! + 1],
        [head[0] + 1, head[1], head[2]! + 1],
        [head[0], head[1] - 1, head[2]! + 1],
        [head[0], head[1] + 1, head[2]! + 1]
      ] as PointPlus[]
    ).filter((p: PointPlus) => {
      if (p[0] < 0 || p[0] >= size[0] || p[1] < 0 || p[1] >= size[1]) return false
      let corruptMemories = bytes.slice(0, p[2])
      if (bytes.find((b) => isSame(p, b))) return false
      return true
    })
  }

  const doSearch = (opened: PointPlus[], data: Data, bytes: Point[]) => {
    let head: PointPlus = opened.splice(-1)[0]!
    log.debug('=== Search ===', head, 'opened', opened.length)
    if (isSame(head, data.end)) {
      if (head[2]! < data.lowestScore) {
        log.info('got lowest', head[2])
        data.lowestScore = head[2]!
      }
      return
    }
    const newPoints: PointPlus[] = getNewPoints(head, data.size, bytes)
    console.log('new points for', head, newPoints)
    if (newPoints.length !== 0) {
      newPoints.forEach((point) => {
        opened.push(point)
      })
    }
    opened.sort((a, b) => getManhattanDistance(b, data.end) - getManhattanDistance(a, data.end))
  }

  const solveFor = (start: Point, end: Point, bytes: Point[]): number => {
    let opened: PointPlus[] = [[...start, 0]]
    let data: Data = { end: params.end, size: params.size, lowestScore: Number.MAX_SAFE_INTEGER }
    let iteration: number = 0
    while (opened.length > 0) {
      doSearch(opened, data, bytes)
      iteration++
    }
    return data.lowestScore
  }

  if (!params.skipPart1) {
    part1 = solveFor(params.start, params.end, bytes)
  }
  if (!params.skipPart2) {
    // part2 = solveFor()
  }

  return { part1, part2 }
}
