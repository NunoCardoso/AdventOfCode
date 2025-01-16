import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location, World } from 'declarations'
import _ from 'lodash'
import { getKey, getManhattanDistance, isSame } from 'util/location'
import { range } from 'util/range'

type Step = [location: Location, cost: number, distance: number]
type QueueIndex = Record<string, number>
type Visited = Record<string, number>
type Data = {
  end: Location
  step?: Step
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const outOfBounds = (location: Location, world: World) =>
    location[0] < 0 || location[1] < 0 || location[0] >= world.length || location[1] >= world[0].length

  const printWorld = (
    world: World<string | number>,
    queue: Step[],
    visited: Record<string, number>,
    finished: Record<string, number>
  ) => {
    world.forEach((row, rowIndex) => {
      let line = ''
      row.forEach((col, colIndex) => {
        let location: Location = [rowIndex, colIndex]
        let key = getKey(location)
        if (visited[key]) line += clc.red('V')
        else if (queue.some((q) => isSame(q[0], location))) line += clc.cyan('O')
        else line += world[rowIndex][colIndex]
      })
      log.info(line)
    })
    log.info('lowest cost', finished.lowestCost)
  }

  const getNewSteps = (
    world: World,
    queue: Step[],
    queueIndex: QueueIndex,
    visited: Visited,
    head: Step,
    data: Data
  ): Step[] => {
    return (
      [
        [[head[0][0] - 1, head[0][1]] as Location, head[1], head[2]],
        [[head[0][0] + 1, head[0][1]] as Location, head[1], head[2]],
        [[head[0][0], head[0][1] - 1] as Location, head[1], head[2]],
        [[head[0][0], head[0][1] + 1] as Location, head[1], head[2]]
      ] as Step[]
    )
      .filter((newHead) => !outOfBounds(newHead[0], world))
      .map(
        (newHead: Step) =>
          [
            newHead[0],
            newHead[1] + world[newHead[0][0]][newHead[0][1]],
            getManhattanDistance(newHead[0], data.end)
          ] as Step
      )
  }

  /*const getNewSteps = (world: World, opened: Array<Step>, visited: Record<string, number>, head: Step, data: Data) => {
    const newSteps: Array<Step> = _.reject(
      [
        [
          [head[0][0] - 1, head[0][1]],
          head[1] +
          (outOfBounds([head[0][0] - 1, head[0][1]], world) ? 0 : (world[head[0][0] - 1][head[0][1]] as number)),
          getManhattanDistance([head[0][0] - 1, head[0][1]], data.end)
        ],
        [
          [head[0][0] + 1, head[0][1]],
          head[1] +
          (outOfBounds([head[0][0] + 1, head[0][1]], world) ? 0 : (world[head[0][0] + 1][head[0][1]] as number)),
          getManhattanDistance([head[0][0] + 1, head[0][1]], data.end)
        ],
        [
          [head[0][0], head[0][1] - 1],
          head[1] +
          (outOfBounds([head[0][0], head[0][1] - 1], world) ? 0 : (world[head[0][0]][head[0][1] - 1] as number)),
          getManhattanDistance([head[0][0], head[0][1] - 1], data.end)
        ],
        [
          [head[0][0], head[0][1] + 1],
          head[1] +
          (outOfBounds([head[0][0], head[0][1] + 1], world) ? 0 : (world[head[0][0]][head[0][1] + 1] as number)),
          getManhattanDistance([head[0][0], head[0][1] + 1], data.end)
        ]
      ],
      (newStep: Step) => {
        if (outOfBounds(newStep[0], world)) {
          return true
        }

        const newKey = getKey(newStep[0])
        // reject if it's in the visited list, and it has a worst cost; otherwise, keep it
        if (Object.prototype.hasOwnProperty.call(visited, newKey) && visited[newKey] <= newStep[1]) {
          return true
        }

        const matchOpenedPathIndex = _.findIndex(opened, (s: Step) => isSame(s[0], newStep[0]))
        if (matchOpenedPathIndex >= 0) {
          // worse cost
          if (opened[matchOpenedPathIndex][1] <= newStep[1]) {
            return true
          } else {
            opened.splice(matchOpenedPathIndex, 1)
          }
        }

        return false
      }
    )

    return newSteps
  }*/

  const printStep = (s: Step) => JSON.stringify(s)

  const Astar = (world: World, queue: Step[], queueIndex: QueueIndex, visited: Visited, data: Data) => {
    const head: Step = queue.pop()!
    const headKey: string = getKey(head[0])
    delete queueIndex[headKey]
    log.debug('=== A* ===', head)
    //log.debug('queue', queue.length, queue.map((s) => printStep(s)).join(', '))

    if (isSame(head[0], data.end)) {
      if (!data.step || data.step[1] > head[1]) {
        log.debug('Found lowest score', head[1])
        data.step = head
      }
      return
    }

    visited[headKey] = head[1]
    let newSteps: Step[] = getNewSteps(world, queue, queueIndex, visited, head, data)
    log.debug('got new steps')
    // log.debug(newSteps.map((step) => printStep(step)).join(', '))

    if (newSteps.length !== 0) {
      newSteps.forEach((newStep) => {
        let newHeadKey = getKey(newStep[0])
        // if visited one has a better cost, do not continue
        // if this has a better one, keep it, visited will be reset later
        if (!!visited[newHeadKey] && visited[newHeadKey] < newStep[1]) return

        // if opened one has a better cost, do not continue
        // else, remove that opened one. This will be added later
        if (!!queueIndex[newHeadKey] && queueIndex[newHeadKey] < newStep[1]) return
        else {
          let index = queue.findIndex((q) => isSame(newStep[0], q[0]))
          if (index >= 0) {
            queue.splice(index, 1)
          }
        }
        queue.push(newStep)
        queueIndex[newHeadKey] = newStep[1]
      })
      // good: lowest cost first, lowest distance after
      queue.sort((a: Step, b: Step) => (b[1] - a[1] > 0 ? 1 : b[1] - a[1] < 0 ? -1 : b[2] - a[2]))

      // not as good
      //queue.sort((a: Step, b: Step) => (2*b[1] + b[2]) - (2*a[1] + a[2]))

      //Bad:
      // queue.sort((a: Step, b: Step) => b[2] - a[2] > 0 ? 1 : b[2] - a[2] < 0 ? -1 : b[1] - a[1])
    }
  }

  const solveFor = (world: World) => {
    let start: Location = [0, 0]
    let end: Location = [world.length - 1, world[0].length - 1]
    let queue: Step[] = [[start, 0, getManhattanDistance(start, end)]]
    let queueIndex: QueueIndex = {}
    queueIndex[getKey(start)] = 0
    let visited: Visited = {}
    let data: Data = {
      end,
      step: undefined
    }
    log.debug('start', start, 'end', end)
    while (queue.length > 0) Astar(world, queue, queueIndex, visited, data)
    return data.step ? data.step[1] : 0
  }

  const world1: World = []
  const world2: World = []

  for await (const line of lineReader) world1.push(line.split('').map(Number))

  for (let worldRow of range(5)) {
    for (let worldColumn of range(5)) {
      for (let row of range(world1.length)) {
        for (let column of range(world1[row].length)) {
          let newValue = (world1[row][column] + worldRow + worldColumn) % 9
          if (newValue === 0) newValue = 9
          const newRow = row + world1.length * worldRow
          const newColumn = column + world1[0].length * worldColumn
          if (!world2[newRow]) world2[newRow] = []
          world2[newRow][newColumn] = newValue
        }
      }
    }
  }

  log.debug('World 1 size', [world1.length, world1[0].length])
  log.debug('World 2 size', [world2.length, world2[0].length])

  if (!params.skipPart1) part1 = solveFor(world1)
  if (!params.skipPart2) part2 = solveFor(world2)

  return { part1, part2 }
}
