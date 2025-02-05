import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location, World } from 'declarations'
import { getKey, getManhattanDistance, isSame } from 'util/location'
import { QueueLinkedList } from 'util/queuelist'

type Step = [row: number, col: number, score: number, path: string[]]

type Data = {
  end: Location
  score: number
  path: string[]
}

type VisitedIndex = Record<string, number>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const getHeight = (level: string): number => 'abcdefghijklmnopqrstuvwxyz'.indexOf(level)

  const outOfBounds = (world: World<string>, step: Step) =>
    step[0] < 0 || step[1] < 0 || step[0] >= world.length || step[1] >= world[0].length

  const getNewSteps = (world: World<string>, step: Step, visitedIndex: VisitedIndex, data: Data): Step[] =>
    (
      [
        [step[0] - 1, step[1], step[2] + 1, step[3]],
        [step[0] + 1, step[1], step[2] + 1, step[3]],
        [step[0], step[1] - 1, step[2] + 1, step[3]],
        [step[0], step[1] + 1, step[2] + 1, step[3]]
      ] as Step[]
    ).filter((newStep: Step) => {
      if (outOfBounds(world, newStep)) return false
      if (getHeight(world[newStep[0]][newStep[1]]) - getHeight(world[step[0]][step[1]]) > 1) return false
      // pointless if this has more cost than the best so far
      if (newStep[2] > data.score) return false
      // we have visited this node before with a better score, give up
      let key = getKey([newStep[0], newStep[1]])
      if (visitedIndex[key] && visitedIndex[key] < newStep[2]) return false
      newStep[3].push(key)
      return true
    })

  const itWillNotBeBetter = (step: Step, data: Data) => {
    if (data.score < step[2] + getManhattanDistance([step[0], step[1]], data.end)) return true
    return false
  }

  const doDijkstra = (world: World<string>, queue: QueueLinkedList<Step>, visitedIndex: VisitedIndex, data: Data) => {
    const step: Step = queue.pop()!
    const key = getKey([step[0], step[1]])
    //log.debug('=== Dijkstra ===', step.location, 'queue', queue.length, 'data', data)

    visitedIndex[key] = step[2]

    if (isSame([step[0], step[1]], data.end)) {
      if (data.score > step[2]) {
        data.score = step[2]
        data.path = step[3]
      }
      return
    }

    // cut this if it will never give something useful
    if (itWillNotBeBetter(step, data)) return

    const newSteps: Step[] = getNewSteps(world, step, visitedIndex, data)
    if (newSteps.length !== 0) {
      newSteps.forEach((newStep) => {
        const key = getKey([newStep[0], newStep[1]])

        // we have this node before as opened
        if (queue.has(key)) {
          let currentScore: number | null = queue.getSort(key)
          // if this is worse, return
          if (currentScore! < newStep[2]) return
          // if it is better, replace it in the queue
          if (currentScore! > newStep[2]) {
            queue.remove(key)
            queue.add(newStep, newStep[2], key)
          }
        } else {
          // if we are here, we did not have this visited or visited with worse score,
          // we do not have this in queue
          queue.add(newStep, newStep[2], key)
        }
      })
    }
  }

  const printData = (world: World<string>, data: Data) => {
    world.forEach((row, i) => {
      log.info(row.map((cell, j) => (data.path.includes(i + ',' + j) ? clc.red(world[i][j]) : world[i][j])).join(''))
    })
    log.info('')
  }

  const solveFor = (world: World<string>, queue: QueueLinkedList<Step>, end: Location): number => {
    const visitedIndex: VisitedIndex = {}
    const data: Data = { end, score: Number.MAX_VALUE, path: [] }
    while (!queue.isEmpty()) doDijkstra(world, queue, visitedIndex, data)
    if (params.ui?.show && params.ui?.end) printData(world, data)
    return data.score
  }

  let rowIndex: number = 0
  const startsPart1: QueueLinkedList<Step> = new QueueLinkedList<Step>()
  const startsPart2: QueueLinkedList<Step> = new QueueLinkedList<Step>()
  let end: Location = [0, 0]
  const world: World<string> = []

  for await (const line of lineReader) {
    const row: string[] = []
    line.split('').forEach((cell: string, colIndex: number) => {
      if (cell === 'S') {
        let key = getKey([rowIndex, colIndex])
        startsPart1.add([rowIndex, colIndex, 0, [key]], 0, key)
        row.push('a')
      } else if (cell === 'a') {
        let key = getKey([rowIndex, colIndex])
        startsPart2.add([rowIndex, colIndex, 0, [key]], 0, key)
        row.push(cell)
      } else if (cell === 'E') {
        end = [rowIndex, colIndex]
        row.push('z')
      } else {
        row.push(cell)
      }
    })
    world.push(row)
    rowIndex++
  }

  let part1: number = solveFor(world, startsPart1, end)
  let part2: number = solveFor(world, startsPart2, end)

  return { part1, part2 }
}
