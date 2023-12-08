import { Params } from 'aoc.d'
import { Point } from 'declarations'
const SparkMD5 = require('spark-md5')

type Step = {
  point: Point
  path: string
  distance: number
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  const part2: string = ''

  const getDistance = (p: Point, finished: any): number => finished.end[0] - p[0] + finished.end[1] - p[1]
  const breathFirst = (opened: Array<Step>, finished: any) => {
    const step: Step = opened.splice(-1)[0]

    // console.log('step',step,'finished',finished)
    if (step.point[0] === finished.end[0] && step.point[1] === finished.end[1]) {
      if (step.path.length < finished.path.length) {
        finished.path = step.path
        // remove opened values that have higher cost than current cost
        for (let i = opened.length - 1; i >= 0; i--) {
          if (opened[i].path.length > finished.path.length) {
            opened.splice(i, 1)
          }
        }
      }
      return
    }

    const md5 = SparkMD5.hash(finished.passcode + step.path).substring(0, 4)

    // deep first, but let's try the most promising one

    const bucketOfSteps: Array<Step> = []
    if (md5[0].match(/[bcdef]/) && step.point[0] > 0) {
      const newPoint: Point = [step.point[0] - 1, step.point[1]]
      const newDistance = getDistance(newPoint, finished)
      if (finished.path.length === 0 || step.path + 1 <= finished.path.length) {
        bucketOfSteps.push({
          point: newPoint,
          path: step.path + 'U',
          distance: newDistance
        })
      }
    }

    if (md5[1].match(/[bcdef]/) && step.point[0] < 3) {
      const newPoint: Point = [step.point[0] + 1, step.point[1]]
      const newDistance = getDistance(newPoint, finished)
      if (finished.path.length === 0 || step.path + 1 <= finished.path.length) {
        bucketOfSteps.push({
          point: newPoint,
          path: step.path + 'D',
          distance: newDistance
        })
      }
    }
    if (md5[2].match(/[bcdef]/) && step.point[1] > 0) {
      const newPoint: Point = [step.point[0], step.point[1] - 1]
      const newDistance = getDistance(newPoint, finished)
      if (finished.path.length === 0 || step.path + 1 <= finished.path.length) {
        bucketOfSteps.push({
          point: newPoint,
          path: step.path + 'L',
          distance: newDistance
        })
      }
    }

    if (md5[3].match(/[bcdef]/) && step.point[1] < 3) {
      const newPoint: Point = [step.point[0], step.point[1] + 1]
      const newDistance = getDistance(newPoint, finished)
      if (finished.path.length === 0 || newDistance <= finished.path.length) {
        bucketOfSteps.push({
          point: newPoint,
          path: step.path + 'R',
          distance: newDistance
        })
      }
    }
    // console.log('md5',md5,'bucket of steps',bucketOfSteps)

    if (bucketOfSteps.length > 0) {
      opened.push(...bucketOfSteps)
      opened.sort((a, b) =>
        a.distance - b.distance < 0 ? 1 : a.distance - b.distance > 0 ? -1 : a.path.length - b.path.length
      )
    }
  }

  const doIt = (passcode: string): string => {
    let it = 0
    const finished: any = {
      path: '',
      passcode: passcode,
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

  part1 = doIt(params.input)

  return { part1, part2 }
}
