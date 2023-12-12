import { Params } from 'aoc.d'
import { intersect } from 'util/arr'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const val = line.split(/[[\]]/)
    const oddsPart1: Array<string> = []
    const evensPart1: Array<string> = []
    const oddsPart2: Array<string> = []
    const evensPart2: Array<string> = []

    // inside brackets will be always on odd index numbers (1,3,5,...)
    val.forEach((v: string, i: number) => {
      const m = v.match(/(.)(.)\2\1/g)
      if (m?.[0][0] !== m?.[0][1]) {
        i % 2 === 0 ? evensPart1.push(m![0]) : oddsPart1.push(m![0])
      }

      for (let j = 0; j < v.length - 2; j++) {
        if (v[j] === v[j + 2] && v[j] !== v[j + 1]) {
          if (i % 2 === 0) {
            evensPart2.push(v[j] + v[j + 1] + v[j + 2])
          } else {
            // let's store the inverse now to make it easy for match
            const reverse = v[j + 1] + v[j] + v[j + 1]
            oddsPart2.push(reverse)
          }
        }
      }
    })

    if (evensPart1.length > 0 && oddsPart1.length === 0) {
      part1++
    }
    const intersection = intersect(oddsPart2, evensPart2)
    if (intersection.length > 0) {
      part2++
    }
  }

  return { part1, part2 }
}
