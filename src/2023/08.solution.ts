import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let instructions: Array<string> = []
  const directions: Map<string, Array<string>> = new Map()

  const greatestCommonDivisor = (a: number, b: number): number => {
    if (b === 0) return a
    return greatestCommonDivisor(b, a % b)
  }

  const lowestCommonMultiplier = (a: number, b: number) => (a * b) / greatestCommonDivisor(a, b)

  for await (const line of lineReader) {
    if (line.length !== 0) {
      const [left, right] = line.split(' = ')
      if (!right) instructions = left.split('')
      else {
        const match = right.match(/\((.+), (.+)\)/)
        directions.set(left, [match[1], match[2]])
      }
    }
  }

  const doIt = (startPattern: string, endPattern: string) => {
    const positions: Array<string> = Array.from(directions.keys()).filter((k: string) =>
      k.endsWith(startPattern)
    )
    const listOfEndingIterationNumbers: Array<number> = []
    let it = 0
    while (listOfEndingIterationNumbers.length < positions.length) {
      positions.forEach((position, i) => {
        const instructionIndex = instructions[it % instructions.length] === 'L' ? 0 : 1
        positions[i] = directions.get(position)![instructionIndex]
        if (position.endsWith(endPattern)) listOfEndingIterationNumbers.push(it)
      })
      it++
    }
    log.debug(listOfEndingIterationNumbers)
    return listOfEndingIterationNumbers.reduce((a, b) => lowestCommonMultiplier(a, b), 1)
  }

  if (!params.skipPart1) {
    part1 = doIt('AAA', 'ZZZ')
  }
  if (!params.skipPart2) {
    part2 = doIt('A', 'Z')
  }

  return { part1, part2 }
}
