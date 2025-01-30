import { Params } from 'aoc.d'
import { leastCommonMultiple } from 'util/commons'

type Directions = Map<string, string[]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const solveFor = (startPattern: string, endPattern: string, directions: Directions, instructions: string[]) => {
    const startPositions: string[] = [...directions.keys()].filter((k: string) => k.endsWith(startPattern))
    const listOfEndingIterationNumbers: number[] = []
    let iterations = 0
    while (listOfEndingIterationNumbers.length < startPositions.length) {
      startPositions.forEach((position, index) => {
        const instructionIndex = instructions[iterations % instructions.length] === 'L' ? 0 : 1
        startPositions[index] = directions.get(position)![instructionIndex]
        if (position.endsWith(endPattern)) listOfEndingIterationNumbers.push(iterations)
      })
      iterations++
    }
    return listOfEndingIterationNumbers.reduce((a, b) => leastCommonMultiple(a, b), 1)
  }

  let instructions: string[] = []
  const directions: Directions = new Map()

  for await (const line of lineReader) {
    if (line.length !== 0) {
      const [from, to] = line.split(' = ')
      if (!to) instructions = from.split('')
      else {
        const [, left, right] = to.match(/\((.+), (.+)\)/)
        directions.set(from, [left, right])
      }
    }
  }

  if (!params.skipPart1) part1 = solveFor('AAA', 'ZZZ', directions, instructions)
  if (!params.skipPart2) part2 = solveFor('A', 'Z', directions, instructions)

  return { part1, part2 }
}
