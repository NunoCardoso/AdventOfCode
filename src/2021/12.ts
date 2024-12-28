import { Params } from 'aoc.d'

type Path = Array<string>
type Steps = Record<string, Array<string>>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const steps: Steps = {}

  for await (const line of lineReader) {
    const val = line.split('-')
    if (!Object.prototype.hasOwnProperty.call(steps, val[0])) {
      steps[val[0]] = [val[1]]
    } else {
      if (steps[val[0]].indexOf(val[1]) < 0) {
        steps[val[0]].push(val[1])
      }
    }

    if (!Object.prototype.hasOwnProperty.call(steps, val[1])) {
      steps[val[1]] = [val[0]]
    } else {
      if (steps[val[1]].indexOf(val[0]) < 0) {
        steps[val[1]].push(val[0])
      }
    }
  }

  const isLowerCase = (a: string) => a.toLowerCase() === a

  const isApprovedPath = (currentPath: Path, head: string, numberOfVisitsForSmallCaves: string): boolean => {
    if (head === 'start') {
      return false
    }

    if (isLowerCase(head)) {
      // no double lowercase values
      if (numberOfVisitsForSmallCaves === 'part1') {
        return !currentPath.includes(head)
      }

      // allow only once a double lowercase
      if (numberOfVisitsForSmallCaves === 'part2') {
        const views: Record<string, number> = {}
        let alreadyHasADoubleLowercase: string | undefined
        currentPath.forEach((v) => {
          if (isLowerCase(v)) {
            if (!Object.prototype.hasOwnProperty.call(views, v)) {
              views[v] = 1
            } else {
              views[v]++
              alreadyHasADoubleLowercase = v
            }
          }
        })

        // we already have a double lowercase, can't have another one
        if (alreadyHasADoubleLowercase === undefined) {
          return true
        }
        if (alreadyHasADoubleLowercase === head) {
          return false
        }
        return views[head] !== 1
      }
    }

    return true
  }

  const findMorePaths = (steps: Steps, currentPath: Path, numberOfVisitsForSmallCaves: string): Array<Path> => {
    const morePaths: Array<Path> = []
    const pathHead = currentPath[currentPath.length - 1]
    const nextHeads: Array<string> = steps[pathHead]

    nextHeads?.forEach((head) => {
      if (isApprovedPath(currentPath, head, numberOfVisitsForSmallCaves)) {
        morePaths.push(currentPath.concat(head))
      }
    })
    return morePaths
  }

  const searchAlgorithm = (
    finishedPaths: Array<Path>,
    steps: Steps,
    currentPath: Path,
    numberOfVisitsForSmallCaves: string
  ) => {
    const morePaths: Array<Path> = findMorePaths(steps, currentPath, numberOfVisitsForSmallCaves)

    // if more paths is empty, this returns
    morePaths.forEach((newPath, i) => {
      if (newPath[newPath.length - 1] === 'end') {
        log.debug('path has end', newPath)
        finishedPaths.push(newPath)
      } else {
        log.debug('#', i, 'going deeper with', newPath.join(','))
        searchAlgorithm(finishedPaths, steps, newPath, numberOfVisitsForSmallCaves)
      }
    })
  }

  const getThem = (steps: Steps, currentPath: Path, numberOfVisitsForSmallCaves: string): number => {
    const finishedPaths: Array<Path> = []
    searchAlgorithm(finishedPaths, steps, currentPath, numberOfVisitsForSmallCaves)
    log.debug(finishedPaths.map((p) => p.join(',')).sort())
    return finishedPaths.length
  }

  part1 = getThem(steps, ['start'], 'part1')
  part2 = getThem(steps, ['start'], 'part2')

  return { part1, part2 }
}
