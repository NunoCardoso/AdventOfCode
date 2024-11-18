import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {

  let part1: number = 0
  let part2: number = 0

  let data: Array<number> = []
  for await (const line of lineReader) {
    data.push(+line)
  }

  const solveFor = (type: string): number => {
    let cursor = 0
    let dataCopy = data.slice()
    let counter = 0
    while (cursor >= 0 && cursor < data.length) {
      let prevCursor = cursor
      cursor += dataCopy[cursor]
      let jump =  type === 'part1'
        ? 1
        : dataCopy[prevCursor] >= 3 ? -1 : 1
      dataCopy[prevCursor] += jump
      counter++
    }
    return counter
  }

  if (!params.skipPart1) {
    part1 = solveFor('part1')
  }
  if (!params.skipPart2) {
    part2 = solveFor('part2')
  }

  return { part1, part2 }
}
