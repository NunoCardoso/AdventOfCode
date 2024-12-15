import { Params } from 'aoc.d'
import { dec2bin } from 'util/conversion'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let remainder = 2147483647

  let generatorValues: Record<string, number> = {}
  for await (const line of lineReader) {
    const values = line.match(/Generator (.) starts with (\d+)/)
    generatorValues[values[1]] = +values[2]
  }

  const getCommonNumbers = (a: string[], b: string[]) => {
    let common: number = 0
    for (var i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] === b[i]) common++
      else return common
    }
  }

  const generateValue = (value: number, generator: number) => (value * generator) % remainder

  const solveFor = (iterations: number, part: string): number => {
    let it = 0
    let count = 0
    let tempValues: Record<string, string[]> = { A: [], B: [] }
    while (it < iterations) {
      Object.keys(generatorValues).forEach((generator) => {
        let newValue = NaN
        if (part === 'part1') {
          newValue = generateValue(generatorValues[generator], params.generator[generator])
          generatorValues[generator] = newValue
        } else {
          while (Number.isNaN(newValue) || newValue % params.multiples[generator] !== 0) {
            newValue = generateValue(generatorValues[generator], params.generator[generator])
            generatorValues[generator] = newValue
          }
        }
        // let newValue = (generatorValues[generator] * params.generator[generator] ) % remainder
        // generatorValues[generator] = newValue
        tempValues[generator] = dec2bin(newValue).toString().split('').reverse()
      })
      let commonNumbers = getCommonNumbers(tempValues['A'], tempValues['B'])!
      if (commonNumbers >= 16) count++
      it++
      if (it % 1000000 === 0) console.log('it', it, 'count', count)
    }
    return count
  }

  if (!params.skipPart1) {
    part1 = solveFor(params.iterations.part1, 'part1')
  }
  if (!params.skipPart2) {
    part2 = solveFor(params.iterations.part2, 'part2')
  }

  return { part1, part2 }
}
