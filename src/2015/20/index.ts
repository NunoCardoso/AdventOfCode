import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  /* an approximation is that the middle divisors are wrapping
    the square root value.
     so, with 30, Math.sqrt(30) is between 5 and 6, which are the
     middle divisors
   */
  const divisors = (n: number): Array<number> => {
    const result = [1, n]
    for (let i = 2; i < Math.pow(n, 0.5); i++) {
      if (n % i === 0) {
        result.push(i)
        result.push(n / i)
      }
    }
    return result
  }

  const threshold = params.threshold

  const usedOnes: Record<string, number> = {}

  for (let i = 1; i < threshold; i++) {
    const div = divisors(i)
    div.forEach((d) => {
      if (Object.prototype.hasOwnProperty.call(usedOnes, d.toString())) {
        if (usedOnes[d.toString()] < 50) {
          usedOnes[d.toString()]++
        }
      } else {
        usedOnes[d.toString()] = 1
      }
    })

    const medResultPart1 = div.reduce((x, y) => x + y, 0)
    const medResultPart2 = div.reduce((x, y) => {
      if (usedOnes[y.toString()] === 50) {
        return x
      }
      return x + y
    }, 0)

    log.debug('i', i, 'medResult', medResultPart1, 'Misses', threshold - medResultPart1)
    if (medResultPart1 * 10 >= threshold) {
      if (part1 === 0) {
        part1 = i
      }
      if (part2 !== 0) {
        break
      }
    }
    if (medResultPart2 * 11 >= threshold) {
      if (part2 === 0) {
        part2 = i
      }
      if (part1 !== 0) {
        break
      }
    }
  }
  return { part1, part2 }
}
