import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const isSafe = (values: number[]) => {
    let direction: number = Number.NaN
    for (var i = 0; i < values.length - 1; i++) {
      if (i === 0 && values[i + 1] !== values[i]) {
        direction = (values[i + 1] - values[i]) / Math.abs(values[i + 1] - values[i])
      }
      let diff = values[i + 1] - values[i]
      if (!((diff >= -3 && diff <= -1 && direction === -1) || (diff >= 1 && diff <= 3 && direction === 1))) return false
    }
    return true
  }

  reading: for await (const line of lineReader) {
    const values: number[] = line.split(' ').map(Number)
    if (isSafe(values)) {
      part1++
      part2++
    } else {
      for (var i = 0; i < values.length; i++) {
        let newValues = [...values]
        newValues.splice(i, 1)
        if (isSafe(newValues)) {
          part2++
          continue reading
        }
      }
    }
  }

  return { part1, part2 }
}
