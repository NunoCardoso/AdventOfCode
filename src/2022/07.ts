import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const dirSizes: Record<string, number> = {}
  let path: string[] = []

  for await (const line of lineReader) {
    if (line.startsWith('$')) {
      if (line.startsWith('$ cd ')) {
        const dir = line.substring('$ cd '.length, line.length)
        if (dir === '/') path = ['']
        else if (dir === '..') path.pop()
        else path.push(dir)
      }
    } else {
      const dirOrFileSize = line.split(' ')[0]
      if (dirOrFileSize.match(/^\d+$/)) {
        for (let i = 0; i < path.length; i++) {
          const newPath = path.slice(0, i + 1).join('/')
          dirSizes[newPath] = (dirSizes[newPath] ?? 0) + +dirOrFileSize
        }
      }
    }
  }

  part1 = Object.keys(dirSizes).reduce(
    (acc: number, key: string) => acc + (dirSizes[key] < params!.cutoffDirSize ? dirSizes[key] : 0),
    0
  )

  const totalOccupied = dirSizes['']
  const unusedSpace = params!.totalDiskSize - totalOccupied
  const minimumNeededToDelete = params!.minSpaceFree - unusedSpace
  part2 = params!.totalDiskSize

  Object.keys(dirSizes)
    .sort((a, b) => dirSizes[b] - dirSizes[a])
    .every((key) => {
      if (dirSizes[key] < part2 && dirSizes[key] > minimumNeededToDelete) part2 = dirSizes[key]
      return dirSizes[key] >= minimumNeededToDelete
    })

  return { part1, part2 }
}
