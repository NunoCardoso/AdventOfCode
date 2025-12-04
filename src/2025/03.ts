import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: string[] = []
  let valueIndex: Index[] = []
  for await (const line of lineReader) {
    values.push(line)
    let index = {}
    line.split('').forEach((l, i) => {
      if (index[l] === undefined) index[l] = []
      index[l].pu
    })
  }

  const solveFor = (howMany: number): number => {
    let res = 0

    values.forEach((value) => {
      let max = 0,
        number = 0
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
