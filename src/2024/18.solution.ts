import { Params } from 'aoc.d'
import clc from 'cli-color'
import { waitForKey } from 'util/promise'

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
  finalStep: Step | undefined
}

type Step = PointObj & {
  distanceDone: number
  distanceLeft: number
  path: PointObj[]
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number | undefined = 0
  let part2: string = ''

  let bytes: PointObj[] = []
  for await (const line of lineReader) {
    let values = line.split(',').map(Number)
    bytes.push({ x: values[0], y: values[1] })
  }

  const getKey = (p: PointObj) => p.x + ',' + p.y

  const isSame = (s1: PointObj, s2: PointObj): boolean => s1.x === s2.x && s1.y === s2.y

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
        .map((s: Step) => ({
          ...s,
          distanceLeft: getManhattanDistance(s, data.end),
          path: [...s.path, s]
        }))
    )
  }

  const printWorld = (opened: Step[], openedIndex: Record<string, number>, visitedIndex: Record<string, number>, data: Data) => {
    for (var row = 0; row < data.size.height; row++) {
      let s = ''
      for (var col = 0; col < data.size.width; col++) {
        let p = { x: col, y: row } as PointObj
        let key = getKey(p)
        if (openedIndex[key] !== undefined) {
          s += clc.blue('O')
        } else if (visitedIndex[key] !== undefined) {
          s += clc.red('V')
        } else if (data.bytes.some((b) => isSame(b, p))) {
          s += clc.yellow('#')
        } else {
          s += '.'
        }
      }
      log.info(s)
    }
  }

  const doAStar = (opened: Step[], openedIndex: Record<string, number>, visitedIndex: Record<string, number>, data: Data) => {
    log.debug('=== A* === opened', opened.length)
    let head: Step = opened.splice(-1)[0]!
    log.debug('Picking head', head)
    let headKey = getKey(head)
    if (isSame(head, data.end)) {
      if (visitedIndex[headKey] === undefined || head.distanceDone! < visitedIndex[headKey]) {
        log.debug('got lowest', head.distanceDone)
        data.finalStep = head
      }
      return
    }
    visitedIndex[headKey] = head.distanceDone
    delete openedIndex[headKey]

    const newSteps: Step[] = getNewSteps(head, data)
    log.debug('new steps for', head, newSteps)
    if (newSteps.length !== 0) {
      newSteps.forEach((newStep) => {
        let stepKey = getKey(newStep)
        // if it matches an openedIndex
        if (openedIndex[stepKey] !== undefined) {
          // the openedIndex is better, so discard it
          if (openedIndex[stepKey] <= newStep.distanceDone) {
            log.trace('openedindex with step', stepKey, 'has distance', openedIndex[stepKey], 'better than step.distanceDone', newStep.distanceDone, ', returning')
            return
          } else {
            // the openedIndex is worse, remove it
            let index = opened.findIndex((s: Step) => getKey(s) === stepKey)
            if (index >= 0) {
              log.trace('openedindex with step', newStep, 'has distance', openedIndex[stepKey], 'worse than step.distanceDone', newStep.distanceDone, ', removing from opened')
              opened.splice(index, 1)
              delete openedIndex[stepKey]
            }
          }
        }

        // if it matches an visitedIndex
        if (visitedIndex[stepKey] !== undefined && visitedIndex[stepKey] <= newStep.distanceDone) {
          log.trace('visitedIndex with step', stepKey, 'has distance', visitedIndex[stepKey], 'better than step.distanceDone', newStep.distanceDone, ', returning')
          return
        }
        opened.push(newStep)
        openedIndex[stepKey] = newStep.distanceDone
      })
      // the ones with shortest path done and expected shortest path ahead should go first
      opened.sort((a, b) => b.distanceDone + b.distanceLeft - a.distanceDone - a.distanceLeft)
    }
  }

  const solveFor = async (startObj: PointObj, endObj: PointObj, bytes: PointObj[]): Promise<Step | undefined> => {
    let data: Data = {
      end: endObj,
      size: params.size,
      bytes: bytes,
      finalStep: undefined
    }
    let opened: Step[] = [
      {
        ...startObj,
        distanceDone: 0,
        distanceLeft: getManhattanDistance(startObj, endObj),
        path: []
      }
    ]
    let openedIndex: Record<string, number> = {}
    let visitedIndex: Record<string, number> = {}
    openedIndex[getKey(startObj)] = 0
    let iteration: number = 0
    while (opened.length > 0) {
      doAStar(opened, openedIndex, visitedIndex, data)
      iteration++
      if (params.ui?.show) printWorld(opened, openedIndex, visitedIndex, data)
      if (params.ui?.keypress) await waitForKey()
    }
    return data.finalStep
  }

  if (!params.skipPart1) {
    let partialBytes = bytes.slice(0, params.time)
    let step = await solveFor(params.start, params.end, partialBytes)
    part1 = step?.distanceDone
  }

  if (!params.skipPart2) {
    let byteThatClosesPath: string | undefined = undefined
    while (!byteThatClosesPath) {
      let time = 1
      let currentWinningPath: PointObj[] = []
      while (true) {
        let partialBytes = bytes.slice(0, time)
        let lastByte = partialBytes[partialBytes.length - 1]
        let lastByteKey = getKey(lastByte)
        // the last byte did not fell on the current path
        if (currentWinningPath.length > 0 && !currentWinningPath.some((p) => isSame(lastByte, p))) {
          log.info('time', time, 'byte', lastByteKey, 'strike water, continue')
          time++
          continue
        }
        log.info('time', time, 'solving ')
        // the last byte not fell on the current path, or there is no visitedIndex
        let step = await solveFor(params.start, params.end, partialBytes)

        log.info('time', time, 'distance done', step?.distanceDone)
        if (step?.distanceDone === undefined) {
          log.info('time', time, 'byte', lastByteKey, 'hit path, had to recalculate, no end value, OBSTRUCT')
          byteThatClosesPath = getKey(lastByte)
          break
        } else {
          log.info('time', time, 'byte', lastByteKey, 'hit path, had to recalculate, end value', step?.distanceDone, 'continue')
          // save new path
          currentWinningPath = step?.path
        }
        time++
      }
    }
    part2 = byteThatClosesPath
  }

  return { part1, part2 }
}
