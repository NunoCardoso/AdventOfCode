import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const [x1, x2, y1, y2] = line.match(/\d+/g).map(Number)
    if ((x1 <= y1 && x2 >= y2) || (y1 <= x1 && y2 >= x2)) part1++
    if (y1 <= x1 ? y2 >= x1 : y1 <= x2) part2++
  }
  return { part1, part2 }
}
