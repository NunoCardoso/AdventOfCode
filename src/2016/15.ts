import { Params } from 'aoc.d'
import { range } from 'util/range'
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const maxPositions: number[] = []
  const initialPositions: number[] = []

  for await (const line of lineReader) {
    const [, maxPosition, position] = line
      .match(/Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)./)
      .map(Number)
    maxPositions.push(maxPosition)
    initialPositions.push(position)
  }

  // for part 2
  if (!params.isTest) {
    maxPositions.push(11)
    initialPositions.push(0)
  }

  let biggestDisc = Math.max(...maxPositions)
  let biggestDiscIndex = maxPositions.indexOf(biggestDisc)
  let positionOfBiggestDisc = initialPositions[biggestDiscIndex]

  let time = biggestDisc - positionOfBiggestDisc - biggestDiscIndex
  while (part1 === 0 || part2 === 0) {
    log.debug('time', time, 'part1', part1, 'part2', part2)
    let upperLimit = maxPositions.length
    // do not check the last wheel for part 1 for prod
    if (!params.isTest && part1 === 0) upperLimit = maxPositions.length - 1

    let found = range(upperLimit).reduce((acc, discIndex) => {
      if ((initialPositions[discIndex] + time + discIndex) % maxPositions[discIndex] !== 0) return false
      return acc
    }, true)

    if (found) {
      // one off, for reasons
      if (part1 === 0) part1 = time - 1
      else part2 = time - 1
    }
    time += biggestDisc
  }

  return { part1, part2 }
}
