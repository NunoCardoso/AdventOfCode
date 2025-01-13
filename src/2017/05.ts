import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const solveFor = (data: number[], type: string): number => {
    let cursor = 0
    let counter = 0
    while (cursor >= 0 && cursor < data.length) {
      let prevCursor = cursor
      cursor += data[cursor]
      let jump = type === 'part1' ? 1 : data[prevCursor] >= 3 ? -1 : 1
      data[prevCursor] += jump
      counter++
    }
    return counter
  }

  let data: number[] = []
  for await (const line of lineReader) data.push(+line)

  part1 = solveFor([...data], 'part1')
  part2 = solveFor([...data], 'part2')

  return { part1, part2 }
}
