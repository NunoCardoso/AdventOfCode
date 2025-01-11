import { Params } from 'aoc.d'
import { Location, LocationPlus, World } from 'declarations'

type Data = {
  end: Location
  lowestScore: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []

  const getKey = (l: LocationPlus) => l[0] + ',' + l[1]
  const isSame = (l1: Location | LocationPlus, l2: Location | LocationPlus) => l1[0] === l2[0] && l1[1] === l2[1]
  const getSpaceOrWall = (world: World<string>, [x, y]: LocationPlus): string => {
    if (!world[y]) world[y] = []
    if (!world[y][x]) {
      const val: number = x * x + 3 * x + 2 * x * y + y + y * y + params.designerNumber
      const bin = (val >>> 0).toString(2)
      const countOnes = bin.split('').filter((x: string) => x === '1').length
      world[y][x] = countOnes % 2 === 0 ? '.' : '#'
    }
    return world[y][x]
  }

  const outOfBounds = (l: LocationPlus) => l[0] < 0 || l[1] < 0

  const getNewPaths = (head: LocationPlus, world: World<string>, visited: Set<string>) =>
    (
      [
        [head[0] - 1, head[1], head[2] + 1],
        [head[0] + 1, head[1], head[2] + 1],
        [head[0], head[1] - 1, head[2] + 1],
        [head[0], head[1] + 1, head[2] + 1]
      ] as LocationPlus[]
    ).filter((newLocation: LocationPlus) => {
      if (outOfBounds(newLocation)) return false
      if (getSpaceOrWall(world, newLocation) === '#') return false
      return !visited.has(getKey(newLocation))
    })

  const doDijkstra = async (
    world: World<string>,
    queue: LocationPlus[],
    visited: Set<string>,
    uniqueLocations: Set<string>,
    data: Data
  ) => {
    let head: LocationPlus = queue.pop()!
    const headKey: string = getKey(head)
    visited.add(headKey)
    if (head[2] <= params.cutoff) uniqueLocations.add(headKey)

    log.trace('=== Dijkstra ===', head, 'opened', queue.length, 'data', data)

    if (isSame(head, data.end)) {
      if (data.lowestScore > head[2]) {
        log.debug('Got lowest score with', head[2])
        data.lowestScore = head[2]
      }
      return
    }

    const newLocations: LocationPlus[] = getNewPaths(head, world, visited)

    if (newLocations.length > 0) {
      newLocations.forEach((newLocation) => {
        // if queue has it with worse score, delete it
        const index = queue.findIndex((l: LocationPlus) => isSame(l, newLocation))
        if (index >= 0) {
          if (queue[index].length > newLocation.length) queue.splice(index, 1)
          else return
        }
        queue.push(newLocation)
      })
      queue.sort((a, b) => b[2] - a[2])
    }
  }

  const data: Data = { end: params.target, lowestScore: Number.MAX_VALUE }
  const start: LocationPlus = [1, 1, 0]
  const queue: LocationPlus[] = [start]
  // we need two, as the solution to part1 is achieved by going over 50 steps
  const visited: Set<string> = new Set()
  const uniqueLocations: Set<string> = new Set()
  visited.add(getKey(start))
  uniqueLocations.add(getKey(start))
  while (queue.length > 0) doDijkstra(world, queue, visited, uniqueLocations, data)
  part1 = data.lowestScore
  part2 = uniqueLocations.size

  return { part1, part2 }
}
