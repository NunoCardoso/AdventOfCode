import { Params } from 'aoc.d'
import { permutation } from '../util/permutation'
import { diagnosticProgram } from './05'

const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

export const amplifierProgram = (values: number[], permute: number[], initialValue: number = 0) => {
  let val: number = diagnosticProgram([...values], [permute[0], initialValue])
  val = diagnosticProgram([...values], [permute[1], val])
  val = diagnosticProgram([...values], [permute[2], val])
  val = diagnosticProgram([...values], [permute[3], val])
  return diagnosticProgram([...values], [permute[4], val])
}

export const amplifierProgram2 = (values: number[], permute: number[], initialValue: number = 0) => {
  let val: number = diagnosticProgram([...values], [permute[0], initialValue])
  log.info(val, [permute[0], initialValue])
  val = diagnosticProgram([...values], [permute[1], val])
  val = diagnosticProgram([...values], [permute[2], val])
  val = diagnosticProgram([...values], [permute[3], val])
  return diagnosticProgram([...values], [permute[4], val])
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: number[] = []
  for await (const line of lineReader) values = line.split(',').map(Number)

  const solveFor = (values: number[]): number => {
    let max: number = 0
    for (let permute of permutation([0, 1, 2, 3, 4])) {
      let val = amplifierProgram(values, permute)
      if (val > max) max = val
    }
    return max
  }

  const solveForPart2 = (values: number[]): number => {
    let max: number = 0
    for (let permute of permutation([5, 6, 7, 8, 9])) {
      let val = amplifierProgram2(values, permute)
      if (val > max) max = val
    }
    return max
  }

  if (!params.skipPart1) part1 = solveFor(values)
  if (!params.skipPart2) part2 = solveForPart2(values)

  return { part1, part2 }
}
