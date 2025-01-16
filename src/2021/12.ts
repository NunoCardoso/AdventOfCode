import { Params } from 'aoc.d'

type Path = string[]
type Connections = Record<string, string[]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const isLowerCase = (a: string) => a.toLowerCase() === a

  const isApprovedPath = (currentPath: Path, head: string, maxNumberOfVisitsToSmallCaves: number): boolean => {
    if (head === 'start') return false

    if (isLowerCase(head)) {
      // no revisiting same lowercase head
      if (maxNumberOfVisitsToSmallCaves === 1) return !currentPath.includes(head)
      // allow only once a double lowercase
      if (maxNumberOfVisitsToSmallCaves === 2) {
        const smallCavesVisits: Record<string, number> = {}
        let smallCaveAlreadyVisitedTwice: string | undefined
        currentPath.forEach((cave) => {
          if (isLowerCase(cave)) {
            if (!smallCavesVisits[cave]) smallCavesVisits[cave] = 1
            else {
              smallCavesVisits[cave]++
              smallCaveAlreadyVisitedTwice = cave
            }
          }
        })
        if (smallCaveAlreadyVisitedTwice === undefined) return true
        if (smallCaveAlreadyVisitedTwice === head) return false
        return smallCavesVisits[head] !== 1
      }
    }
    return true
  }

  const findMorePaths = (steps: Connections, currentPath: Path, maxNumberOfVisitsToSmallCaves: number): Path[] => {
    const newPaths: Path[] = []
    const head = currentPath[currentPath.length - 1]
    const candidateHeads: string[] = steps[head]
    candidateHeads.forEach((head) => {
      if (isApprovedPath(currentPath, head, maxNumberOfVisitsToSmallCaves)) newPaths.push(currentPath.concat(head))
    })
    return newPaths
  }

  const doBreadthFirst = (
    finishedPaths: Path[],
    steps: Connections,
    currentPath: Path,
    maxNumberOfVisitsToSmallCaves: number
  ) => {
    findMorePaths(steps, currentPath, maxNumberOfVisitsToSmallCaves).forEach((newPath) => {
      if (newPath[newPath.length - 1] === 'end') finishedPaths.push(newPath)
      else doBreadthFirst(finishedPaths, steps, newPath, maxNumberOfVisitsToSmallCaves)
    })
  }

  const solveFor = (steps: Connections, maxNumberOfVisitsToSmallCaves: number): number => {
    const finishedPaths: Path[] = []
    let queue = ['start']
    doBreadthFirst(finishedPaths, steps, queue, maxNumberOfVisitsToSmallCaves)
    log.debug(finishedPaths.map((p) => p.join(',')).sort())
    return finishedPaths.length
  }

  const connections: Connections = {}
  for await (const line of lineReader) {
    const caves = line.split('-')
    if (!connections[caves[0]]) connections[caves[0]] = [caves[1]]
    else connections[caves[0]].push(caves[1])
    if (!connections[caves[1]]) connections[caves[1]] = [caves[0]]
    else connections[caves[1]].push(caves[0])
  }

  part1 = solveFor(connections, 1)
  part2 = solveFor(connections, 2)

  return { part1, part2 }
}
