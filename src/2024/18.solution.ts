import { Params } from 'aoc.d'

type DimensionObj = {
  width: number
  height: number
}

type PointObj = {
  x: number
  y: number
}

type Data = {
  end: PointObj
  size: DimensionObj
  bytes: PointObj[]
}

type Step = PointObj & {
  distanceDone: number
  distanceLeft: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let bytes: PointObj[] = []
  for await (const line of lineReader) {
    let values = line.split(',').map(Number)
    bytes.push({ x: values[0], y: values[1] })
  }

  const getKey = (p: PointObj) => p.x + ',' + p.y

  const isSame = (s1: PointObj, s2: PointObj): boolean => s1.x === s2.y && s1.y === s2.y

  const getManhattanDistance = (s1: PointObj, s2: PointObj) => Math.abs(s1.x - s2.x) + Math.abs(s1.y - s2.y)

  const getNewSteps = (head: Step, data: Data): Step[] => {
    return (
      (
        [
          { ...head, x: head.x - 1, y: head.y, distanceDone: head.distanceDone + 1 },
          { ...head, x: head.x + 1, y: head.y, distanceDone: head.distanceDone + 1 },
          { ...head, x: head.x, y: head.y - 1, distanceDone: head.distanceDone + 1 },
          { ...head, x: head.x, y: head.y + 1, distanceDone: head.distanceDone + 1 }
        ] as Step[]
      )
        .filter((s: Step) => {
          // if
          if (s.x < 0 || s.x >= data.size.width || s.y < 0 || s.y >= data.size.height) return false
          // if hitting one of corrupt memories, refuse
          if (data.bytes.find((memory) => isSame({ x: memory.x, y: memory.y }, s))) return false
          return true
        })
        // add the remaining distance for the good steps, so they can be sorted
        .map((s: Step) => ({ ...s, distanceLeft: getManhattanDistance(s, data.end) }))
    )
  }

  const doAStar = (
    opened: Step[],
    openedIndex: Record<string, number>,
    visitedIndex: Record<string, number>,
    data: Data
  ) => {
    let head: Step = opened.splice(-1)[0]!
    let headKey = getKey(head)
    log.debug('=== Search ===', head, 'opened', opened.length)
    if (isSame(head, data.end)) {
      if (head.distanceDone! < visitedIndex[headKey]) {
        log.info('got lowest', head.distanceDone)
        visitedIndex[headKey] = head.distanceDone
      }
      return
    }
    delete openedIndex[headKey]

    const newSteps: Step[] = getNewSteps(head, data)
    //console.log('new steps for', head, newSteps)
    if (newSteps.length !== 0) {
      newSteps.forEach((step) => {
        let stepKey = getKey(step)
        // if it matches an openedIndex
        if (!!openedIndex[stepKey]) {
          // the openedIndex is better, so discard it
          if (openedIndex[stepKey] <= step.distanceDone) {
            return
          } else {
            // the openedIndex is worse, remove it
            let index = opened.findIndex((s: Step) => getKey(s) === stepKey)
            if (index >= 0) opened.splice(index, 1)
          }
        }

        // if it matches an visitedIndex
        if (!!visitedIndex[stepKey]) {
          // the visitedIndex is better, so discard it
          if (visitedIndex[stepKey] <= step.distanceDone) {
            return
          } else {
            // visitedIndex is worse, replace it
            visitedIndex[stepKey] = step.distanceDone
          }
        } else {
          // visitedIndex is absent, add it
          visitedIndex[stepKey] = step.distanceDone
        }

        opened.push(step)
      })
      // the ones with shortest path done and expected shortest path ahead should go first
      opened.sort((a, b) => b.distanceDone + b.distanceLeft - a.distanceDone - a.distanceLeft)
    }
  }

  const solveFor = (startObj: PointObj, endObj: PointObj, bytes: PointObj[]): number => {
    let opened: Step[] = [
      {
        ...startObj,
        distanceDone: 0,
        distanceLeft: getManhattanDistance(startObj, endObj)
      }
    ]
    let openedIndex: Record<string, number> = {}
    let visitedIndex: Record<string, number> = {}
    openedIndex[getKey(startObj)] = 0
    visitedIndex[getKey(startObj)] = 0
    let data: Data = {
      end: endObj,
      size: params.size,
      bytes: bytes.slice(0, params.time)
    }
    let iteration: number = 0
    while (opened.length > 0) {
      doAStar(opened, openedIndex, visitedIndex, data)
      iteration++
    }
    console.log(visitedIndex)
    return visitedIndex[getKey(endObj)]
  }

  if (!params.skipPart1) {
    part1 = solveFor(params.start, params.end, bytes)
  }
  if (!params.skipPart2) {
    // part2 = solveFor()
  }

  return { part1, part2 }
}
