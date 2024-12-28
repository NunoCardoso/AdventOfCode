import { Params } from 'aoc.d'
import { Point } from 'declarations'
const SparkMD5 = require('spark-md5')

// point, path
type Path = string
type Step = [Point, Path]

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

  const isInEnd = (step: Step, finished: Finished) => step[0][0] === finished.end[0] && step[0][1] === finished.end[1]

  const goodToAdd = (step: Step, finished: Finished) =>
    // for part1, I can truncate the new paths that are bigger than the best one so far
    finished.mode === 'part2' || finished.path.length === 0 || step[1].length + 1 <= finished.path.length

  const getNewSteps = (md5: string, step: Step, finished: Finished): Array<Step> => {
    const bucketOfSteps: Array<Step> = []
    if (md5[0].match(/[bcdef]/) && step[0][0] > 0 && goodToAdd(step, finished)) {
      bucketOfSteps.push([[step[0][0] - 1, step[0][1]], step[1] + 'U'])
    }
    if (md5[1].match(/[bcdef]/) && step[0][0] < 3 && goodToAdd(step, finished)) {
      bucketOfSteps.push([[step[0][0] + 1, step[0][1]], step[1] + 'D'])
    }
    if (md5[2].match(/[bcdef]/) && step[0][1] > 0 && goodToAdd(step, finished)) {
      bucketOfSteps.push([[step[0][0], step[0][1] - 1], step[1] + 'L'])
    }
    if (md5[3].match(/[bcdef]/) && step[0][1] < 3 && goodToAdd(step, finished)) {
      bucketOfSteps.push([[step[0][0], step[0][1] + 1], step[1] + 'R'])
    }
    return bucketOfSteps
  }

  const breathFirst = (opened: Array<Step>, finished: Finished) => {
    const step: Step = opened.splice(-1)[0]

    log.debug('step', step, 'finished', finished)

    if (isInEnd(step, finished)) {
      // part1: smallest path
      if (finished.mode === 'part1' && (finished.path.length === 0 || step[1].length < finished.path.length)) {
        finished.path = step[1]
      }
      // part2: longest path
      if (finished.mode === 'part2' && step[1].length > finished.path.length) {
        finished.path = step[1]
      }
      return
    }

    const md5 = SparkMD5.hash(finished.passcode + step[1]).substring(0, 4)
    const bucketOfSteps: Array<Step> = getNewSteps(md5, step, finished)
    if (bucketOfSteps.length > 0) opened.push(...bucketOfSteps)
  }

  const solveFor = (passcode: string, mode: string): string => {
    let it = 0
    const finished: Finished = {
      path: '',
      passcode: passcode,
      mode: mode,
      end: [3, 3]
    }
    const opened: Array<Step> = [[[0, 0], '']]
    while (opened.length > 0) {
      breathFirst(opened, finished)
      if (it % 100 === 0) {
        log.debug('it', it, 'opened', opened.length, 'finished', finished)
      }
      it++
    }
    return finished.path
  }

  if (!params.skipPart1) part1 = solveFor(params.input, 'part1')
  if (!params.skipPart2) part2 = solveFor(params.input, 'part2').length

  return { part1, part2 }
}
