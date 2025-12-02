import { Params } from 'aoc.d'
import { Location, LocationPlus } from 'declarations'

const SparkMD5 = require('spark-md5')

type Mode = 'shortest' | 'longest'
type Data = {
  path: string
  passcode: string
  mode: Mode
  end: Location
}
// [x:number, y:number, path:string]
type Step = LocationPlus<string>
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: number = 0

  const isSame = (step: Step, end: Location) => step[0] === end[0] && step[1] === end[1]

  const goodToAdd = (step: Step, data: Data) =>
    // for part1, I can truncate the new paths that are bigger than the best one so far
    data.mode === 'longest' || data.path.length === 0 || step[2].length + 1 <= data.path.length

  const getNewSteps = (md5: string, step: Step, data: Data): Step[] => {
    const newSteps: Step[] = []
    if (md5[0].match(/[bcdef]/) && step[0] > 0 && goodToAdd(step, data)) {
      newSteps.push([step[0] - 1, step[1], step[2] + 'U'])
    }
    if (md5[1].match(/[bcdef]/) && step[0] < 3 && goodToAdd(step, data)) {
      newSteps.push([step[0] + 1, step[1], step[2] + 'D'])
    }
    if (md5[2].match(/[bcdef]/) && step[1] > 0 && goodToAdd(step, data)) {
      newSteps.push([step[0], step[1] - 1, step[2] + 'L'])
    }
    if (md5[3].match(/[bcdef]/) && step[1] < 3 && goodToAdd(step, data)) {
      newSteps.push([step[0], step[1] + 1, step[2] + 'R'])
    }
    return newSteps
  }

  const doPathFinding = (queue: Step[], data: Data) => {
    const step: Step = queue.pop()!
    log.debug('=== Breadth first ===', step)
    if (isSame(step, data.end)) {
      // part1: smallest path
      if (data.mode === 'shortest' && (data.path.length === 0 || step[2].length < data.path.length)) {
        data.path = step[2]
      }
      // part2: longest path
      if (data.mode === 'longest' && step[2].length > data.path.length) {
        data.path = step[2]
      }
      return
    }

    const md5 = SparkMD5.hash(data.passcode + step[2]).substring(0, 4)
    queue.push(...getNewSteps(md5, step, data))
  }

  const solveFor = (passcode: string, mode: Mode): string => {
    const data: Data = { path: '', passcode, mode, end: [3, 3] }
    const queue: Step[] = [[0, 0, '']]
    while (queue.length > 0) doPathFinding(queue, data)
    return data.path
  }

  if (!params.skipPart1) part1 = solveFor(params.input, 'shortest')
  if (!params.skipPart2) part2 = solveFor(params.input, 'longest').length

  return { part1, part2 }
}
