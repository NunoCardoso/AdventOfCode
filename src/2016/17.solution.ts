import { Params } from 'aoc'
import { Point } from 'declarations'
const SparkMD5 = require('spark-md5')

type Step = {
  point: Point
  path: string
  distance: number
}

type Finished = {
  path: string
  passcode: string
  mode: string
  end: Point
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: number = 0

  const isInEnd = (step: Step, finished: Finished) =>
    step.point[0] === finished.end[0] && step.point[1] === finished.end[1]
  const getDistance = (p: Point, finished: Finished): number =>
    finished.end[0] - p[0] + finished.end[1] - p[1]

  const goodToAdd = (step: Step, finished: Finished) =>
    // for part1, I can truncate the new paths that are bigger than the best one so far
    finished.mode === 'part2' || finished.path.length === 0 || step.path.length + 1 <= finished.path.length

  const breathFirst = (opened: Array<Step>, finished: Finished) => {
    const step: Step = opened.splice(-1)[0]

    log.debug('step', step, 'finished', finished)

    if (isInEnd(step, finished)) {
      // part1: smallest path
      if (finished.mode === 'part1') {
        if (finished.path.length === 0 || step.path.length < finished.path.length) {
          finished.path = step.path
          // remove opened values that have higher cost than current cost
          for (let i = opened.length - 1; i >= 0; i--) {
            if (opened[i].path.length > finished.path.length) {
              opened.splice(i, 1)
            }
          }
        }
      }
      // part2: longet path
      if (finished.mode === 'part2') {
        if (step.path.length > finished.path.length) {
          finished.path = step.path
        }
      }
      return
    }

    const md5 = SparkMD5.hash(finished.passcode + step.path).substring(0, 4)

    const bucketOfSteps: Array<Step> = []
    if (md5[0].match(/[bcdef]/) && step.point[0] > 0 && goodToAdd(step, finished)) {
      const newPoint: Point = [step.point[0] - 1, step.point[1]]
      const newDistance = getDistance(newPoint, finished)

      bucketOfSteps.push({
        point: newPoint,
        path: step.path + 'U',
        distance: newDistance
      })
    }

    if (md5[1].match(/[bcdef]/) && step.point[0] < 3 && goodToAdd(step, finished)) {
      const newPoint: Point = [step.point[0] + 1, step.point[1]]
      const newDistance = getDistance(newPoint, finished)
      bucketOfSteps.push({
        point: newPoint,
        path: step.path + 'D',
        distance: newDistance
      })
    }

    if (md5[2].match(/[bcdef]/) && step.point[1] > 0 && goodToAdd(step, finished)) {
      const newPoint: Point = [step.point[0], step.point[1] - 1]
      const newDistance = getDistance(newPoint, finished)
      bucketOfSteps.push({
        point: newPoint,
        path: step.path + 'L',
        distance: newDistance
      })
    }

    if (md5[3].match(/[bcdef]/) && step.point[1] < 3 && goodToAdd(step, finished)) {
      const newPoint: Point = [step.point[0], step.point[1] + 1]
      const newDistance = getDistance(newPoint, finished)
      bucketOfSteps.push({
        point: newPoint,
        path: step.path + 'R',
        distance: newDistance
      })
    }

    if (bucketOfSteps.length > 0) {
      opened.push(...bucketOfSteps)
      opened.sort((a, b) =>
        a.distance - b.distance < 0 ? 1 : a.distance - b.distance > 0 ? -1 : a.path.length - b.path.length
      )
    }
  }

  const doIt = (passcode: string, mode: string): string => {
    let it = 0
    const finished: Finished = {
      path: '',
      passcode: passcode,
      mode: mode,
      end: [3, 3]
    }
    const opened: Array<Step> = [{ point: [0, 0], path: '', distance: 6 }]
    while (opened.length > 0) {
      breathFirst(opened, finished)
      if (it % 100 === 0) {
        log.debug('it', it, 'opened', opened.length, 'finished', finished)
      }
      it++
    }
    return finished.path
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doIt(params.input, 'part1')
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = doIt(params.input, 'part2').length
  }

  return { part1, part2 }
}
