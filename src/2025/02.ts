import { Params } from 'aoc.d'
import { divisors } from 'util/divisors'
import { rangeFromToInclusive } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let ranges: [number, number][] = []
  for await (const line of lineReader) {
    ranges = line.split(',').map((l: string) => l.split('-').map(Number))
  }

  const getHalfRanges = (range: number[]): number[] =>
    range.map((r) => {
      let s = String(r)
      s = s.substring(0, s.length / 2)
      return Number(s)
    })

  const solveFor = (part: string): number => {
    let total = 0
    let newRanges: [number, number][] = []
    ranges.forEach((range) => {
      let asString: [string, string] = [String(range[0]), String(range[1])]
      if (asString[0].length < asString[1].length) {
        newRanges.push([range[0], Number('9'.repeat(asString[0].length))])
        newRanges.push([Number('1' + '0'.repeat(asString[0].length)), range[1]])
      } else {
        newRanges.push(range)
      }
    })

    newRanges.forEach((range) => {
      if (part === 'part1') {
        // only even numbers make sense for part 1
        if (String(range[0]).length % 2 === 0) {
          let rangeHalves = getHalfRanges(range)
          let possibleNumbers = rangeFromToInclusive(rangeHalves[0], rangeHalves[1])
          possibleNumbers.forEach((number) => {
            const testNumber = Number(String(number).repeat(2))
            if (range[0] <= testNumber && testNumber <= range[1]) total += testNumber
          })
        }
      } else {
        let previouslyGeneratedNumbers: number[] = []
        let asString = String(range[0])
        let divisorList = divisors(asString.length)
        divisorList.pop()
        for (const d of divisorList) {
          let stubNumberLeft = +asString.substring(0, +d)
          let stubNumberRight = +String(range[1]).substring(0, +d)
          let stubRange = rangeFromToInclusive(stubNumberLeft, stubNumberRight)
          for (const s of stubRange) {
            let substring = String(s).repeat(asString.length / +d)
            let testNumber = +substring
            if (range[0] <= testNumber && testNumber <= range[1]) {
              if (!previouslyGeneratedNumbers.includes(testNumber)) {
                total += testNumber
                previouslyGeneratedNumbers.push(testNumber)
              }
            }
          }
        }
      }
    })

    return total
  }

  if (!params.skipPart1) part1 = solveFor('part1')
  if (!params.skipPart2) part2 = solveFor('part2')

  return { part1, part2 }
}
