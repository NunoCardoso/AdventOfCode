import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location, World } from 'declarations'
import { getKey, getManhattanDistance, isSame } from 'util/location'
import { QueueLinkedList } from 'util/queuelist'
import { range } from 'util/range'

type Step = [location: Location, cost: number, distance: number]

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

  const getNewSteps = (world: World, visited: Visited, head: Step, data: Data): Step[] => {
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

  const isWorthless = (data: Data, head: Step) => {
    // cost + distance, assuming distance is manhattan distance with only 1s
    if (!data.step) return false
    if (head[1] + head[2] >= data.step[1]) return true
    return false
  }

  const Astar = (world: World, queue: QueueLinkedList<Step>, visited: Visited, data: Data) => {
    const head: Step = queue.pop()!
    const headKey: string = getKey(head[0])

    visited[headKey] = head[1]

    if (isSame(head[0], data.end)) {
      if (!data.step || data.step[1] > head[1]) data.step = head
      return
    }

    // if (isWorthless(data, head)) return

    let newSteps: Step[] = getNewSteps(world, visited, head, data)

    if (newSteps.length !== 0) {
      newSteps.forEach((newStep) => {
        let key = getKey(newStep[0])
        if (queue.has(key)) {
          let currentScore: number | null = queue.getSort(key)
          // if this is worse, return
          if (currentScore! < newStep[1]) return
          // if it is better, replace it in the queue
          if (currentScore! > newStep[1]) {
            queue.remove(key)
            queue.add(newStep, newStep[1], key)
          }
        } else {
          // if we are here, we did not have this visited or visited with worse score,
          // we do not have this in queue
          queue.add(newStep, newStep[1], key)
        }
      })
      // good: lowest cost first, lowest distance after
      //  queue.sort((a: Step, b: Step) => (b[1] - a[1] > 0 ? 1 : b[1] - a[1] < 0 ? -1 : b[2] - a[2]))

      // this is good for some reason
      //  queue.sort((a: Step, b: Step) => 1 * (b[1] - a[1]) - 100 * (b[2] - a[2]))

      //Bad sort by distance
      // queue.sort((a: Step, b: Step) => b[2] - a[2] > 0 ? 1 : b[2] - a[2] < 0 ? -1 : b[1] - a[1])
    }
  }

  const solveFor = (world: World) => {
    let start: Location = [0, 0]
    let end: Location = [world.length - 1, world[0].length - 1]
    let queue: QueueLinkedList<Step> = new QueueLinkedList<Step>()
    queue.add([start, 0, getManhattanDistance(start, end)], 0, getKey(start)) /// THIS
    let visited: Visited = {}
    let data: Data = {
      end,
      step: undefined
    }
    let iterations: number = 0
    while (!queue.isEmpty()) {
      Astar(world, queue, visited, data)
      iterations++
      if (iterations % 50000 == 0) {
        log.info('i', iterations, 'queue', queue.size)
      }
    }
    return data.step![1]
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

  if (!params.skipPart1) part1 = solveFor(world1)
  if (!params.skipPart2) part2 = solveFor(world2)

  return { part1, part2 }
}
