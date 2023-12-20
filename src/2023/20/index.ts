import { Params } from 'aoc.d'

type Cables = any
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const cables: Cables = {}
  for await (const line of lineReader) {
    const [left, right] = line.split(' -> ')
    cables[left] = right.split(', ')
  }

  const solveFor = (): number => {
    /*
    %flip-flop only reacts to low pulses
    flips on => sends high pulse
    flips off => sends low pulse

    &conjunction => if all is high, sends a low, otherwise a hih

    */
    return 0
  }

  if (!params.skipPart1) {
    part1 = solveFor()
  }
  if (!params.skipPart2) {
    part2 = solveFor()
  }

  return { part1, part2 }
}
