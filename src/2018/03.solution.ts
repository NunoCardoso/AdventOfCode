import { Params } from 'aoc.d'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<number[]> = new Array(params.size)
    .fill(null)
    .map(() => new Array(params.size).fill(null).map(() => []))

  const areas: Record<string, number> = {}

  for await (const line of lineReader) {
    const [, id, x, y, w, h] = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/).map(Number)
    areas['' + id] = w * h
    for (var i = x; i < x + w; i++) {
      for (var j = y; j < y + h; j++) {
        world[i][j].push(id)
      }
    }
  }

  if (!params.skipPart1) {
    part1 = world.reduce(
      (acc, row) => acc + row.reduce((acc2, cell) => acc2 + (cell.length >= 2 ? 1 : 0), 0),
      0
    )
  }

  if (!params.skipPart2) {
    let dic: Record<string, number> = {}
    world.forEach((row) =>
      row.forEach((cell) => {
        if (cell.length === 1) {
          let id = cell[0]
          dic['' + id] ? dic['' + id]++ : (dic['' + id] = 1)
        }
      })
    )

    // which id has the whole area covered by cells with 1 element
    let found = Object.keys(areas).find((id) => areas[id] === dic[id])
    if (found) part2 = +found
  }

  return { part1, part2 }
}
