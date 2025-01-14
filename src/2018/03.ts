import { Params } from 'aoc.d'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<number[]> = new Array(params.size)
    .fill(null)
    .map(() => new Array(params.size).fill(null).map(() => []))

  const areas: Map<number, number> = new Map()

  for await (const line of lineReader) {
    const [, id, x, y, w, h] = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/).map(Number)
    areas.set(id, w * h)
    for (var i = x; i < x + w; i++) {
      for (var j = y; j < y + h; j++) {
        world[i][j].push(id)
      }
    }
  }

  part1 = world.reduce((acc, row) => acc + row.reduce((acc2, cell) => acc2 + (cell.length >= 2 ? 1 : 0), 0), 0)

  let idAndAreaMap: Map<number, number> = new Map()
  world.forEach((row) =>
    row.forEach((cell) => {
      if (cell.length === 1) {
        let id = cell[0]
        idAndAreaMap.set(id, (idAndAreaMap.get(id) ?? 0) + 1)
      }
    })
  )

  // which id has the whole area covered by cells with 1 element
  let found = [...areas.keys()].find((id) => areas.get(id) === idAndAreaMap.get(id))
  if (found) part2 = +found

  return { part1, part2 }
}
