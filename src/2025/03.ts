import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: string[] = []
  // indexes for each number, so I can analyse 9, then 8, etc
  let valueIndex: Record<string, number>[] = []
  for await (const line of lineReader) {
    values.push(line)
    let index: Record<string, number> = {}
    line.split('').forEach((l, i) => {
      if (index[l] === undefined) index[l] = []
      index[l].push(i)
    })
    valueIndex.push(index)
  }

  const solveFor = (howMany: number): number => {
    let res = 0

    values.forEach((value, i) => {
      let max = 0,
        number = 0

      let index: Record<string, number> = valueIndex[i]
      // index for the number

      let template = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

      //do
      for (let i = 0; i < value.length - 1; i++) {
        for (let j = i + 1; j < value.length; j++) {
          number = Number(value[i] + value[j])
          if (number > max) max = number
        }
      }
      //console.log('value', value, 'max', max)
      res += max
    })
    return res
  }

  /* const solveFor = (): number => {
     let res = 0
     values.forEach(value => {
        let max = 0, number = 0
        for (let i = 0; i < value.length - 1; i++) {
          for (let j = i + 1; j < value.length; j++) {
            number = Number(value[i] + value[j])
            if ( number > max ) max = number
          }
        }
        //console.log('value', value, 'max', max)
        res += max
     })
     return res
   }*/

  if (!params.skipPart1) part1 = solveFor(2)
  if (!params.skipPart2) part2 = solveFor(12)

  return { part1, part2 }
}
