import { Params } from 'aoc.d'
import { Location, World } from 'declarations'
import * as location from '../util/location'

type Data = { end: Location; path: Path | undefined }
type Path = Location[]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []

  const getSpaceOrWall = (world: World<string>, [x, y]: Location): string => {
    if (!world[y]) world[y] = []
    if (!world[y][x]) {
      const val: number = x * x + 3 * x + 2 * x * y + y + y * y + params.designerNumber
      const bin = (val >>> 0).toString(2)
      const countOnes = bin.split('').filter((x: string) => x === '1').length
      world[y][x] = countOnes % 2 === 0 ? '.' : '#'
    }
    return world[y][x]
  }

  const outOfBounds = (l: Location) => l[0] < 0 || l[1] < 0

  // reverse, so it can hit the end of the list first
  const inTail = (head: Location, path: Path) => path.reverse().some((l) => location.isSame(l, head))
  const getNewPaths = (path: Path, world: World<string>, visited: Set<string>) => {
    let head = path[path.length - 1]
    return (
      [
        [head[0] - 1, head[1]],
        [head[0] + 1, head[1]],
        [head[0], head[1] - 1],
        [head[0], head[1] + 1]
      ] as Location[]
    )
      .filter((newLocation: Location) => {
        if (outOfBounds(newLocation)) return false
        if (getSpaceOrWall(world, newLocation) === '#') return false
        if (inTail(newLocation, path)) return false
        return !visited.has(location.getKey(newLocation))
      })
      .map((newLocation: Location) => [...path, newLocation])
  }

  const doDijkstra = async (world: World<string>, queue: Path[], visited: Set<string>, data: Data, type: string) => {
    const path: Path = queue.pop()!
    let head: Location = path[path.length - 1]
    const headKey: string = location.getKey(head)
    visited.add(headKey)

    log.trace('=== Dijkstra ===', head, 'opened', queue.length, 'data', data)

    // if part1, we return when getting to the end
    if (type === 'part1' && location.isSame(head, data.end)) {
      if (!data.path || data.path.length > path.length) {
        log.debug('Got lowest score with', head, path.length)
        data.path = path
      }
      return
    }
    // if part2, return when we do X steps
    if (type === 'part2' && path.length > params.cutoff) return

    const newPaths: Path[] = getNewPaths(path, world, visited)

    if (newPaths.length > 0) {
      newPaths.forEach((newPath) => {
        let newHead = newPath[newPath.length - 1]
        const newHeadKey = location.getKey(newHead)
        // if queue has it with worse score, delete it
        const index = queue.findIndex((p: Path) => location.isSame(p[p.length - 1], newHead))
        if (index >= 0 && queue[index].length > newPath.length) queue.splice(index, 1)
        queue.push(newPath)
      })
      queue.sort((a: Path, b: Path) => b.length - a.length)
    }
  }

  const solveFor = (world: World<string>, target: Location, type: string): number => {
    const data: Data = { end: target, path: undefined }
    const start: Path = [[1, 1]]
    const queue: Path[] = [start]
    const visited: Set<string> = new Set()
    visited.add(location.getKey([1, 1]))
    while (queue.length > 0) doDijkstra(world, queue, visited, data, type)
    if (type === 'part1') return data.path!.length - 1 // (start point does not count)
    if (type === 'part2') return visited.size
    return 0
  }

  if (!params.skipPart1) part1 = solveFor(world.slice(), params.target, 'part1')
  if (!params.skipPart2) part2 = solveFor(world.slice(), params.target, 'part2')

  return { part1, part2 }
}
