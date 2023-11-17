import { Params } from 'aoc.d'
import { parseInt } from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let data: string = ''
  for await (const line of lineReader) {
    data = line
  }

  const solveFor = (data: string, collectAfterExpand: boolean): number => {
    let line = data
    let size = 0

    while (line.length > 0) {
      if (!line.startsWith('(')) {
        const index = line.indexOf('(')
        if (index >= 0) {
          const chunk = line.substring(0, index)
          size += chunk.length
          line = line.substring(index, line.length)
        } else {
          size += line.length
          line = ''
        }
      } else {
        const index = line.indexOf(')')
        const chunk = line.substring(0, index + 1)
        line = line.substring(index + 1, line.length)
        // line is free of the operation

        const m = chunk.match(/\((\d+)x(\d+)\)/)
        const length = parseInt(m![1])
        const repeat = parseInt(m![2])

        if (collectAfterExpand) {
          line = line.substring(length, line.length)
          size += length * repeat
        } else {
          const pattern = line.substring(0, length)
          const number = solveFor(pattern, collectAfterExpand)
          size += number * repeat
          line = line.substring(length, line.length)
        }
      }
    }
    return size
  }

  if (params.part1?.skip !== true) {
    part1 = solveFor(data, true)
  }
  if (params.part2?.skip !== true) {
    part2 = solveFor(data, false)
  }

  return { part1, part2 }
}
