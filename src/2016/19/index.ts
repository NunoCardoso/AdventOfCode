import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values = line.split('')
    part1 = values.length
    part2 = values.length
  }

  const solveFor = (elvesNumber: number): number => {

    let elves = Array.from({length: elvesNumber}, (_, index) => ({
      elf: index + 1,
      presents: 1
    }))

    let it = 0
    while (elves.length > 1) {
      nextIndex = (it + 1 % elvesNumber)
      elves[it].presents += elves[ (it + 1 % elvesNumber) ].presents
      elves.splice(it+1[]
            }
    for (var i = 0; i < )
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = solveFor(params.elves)
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = solveFor()
  }


  return { part1, part2 }
}
