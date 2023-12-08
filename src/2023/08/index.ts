import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let instructions: Array<string> = []
  const directions: Record<string, Array<string>> = {}

  const gcd = (a: number, b: number): number => {
    if (b === 0) return a
    return gcd(b, a % b)
  }

  const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b)
  }

  for await (const line of lineReader) {
    const values = line.split(' = ')
    if (line.length !== 0) {
      if (values.length === 1) {
        instructions = values[0].split('')
      } else {
        const m = values[1].match(/\((.+), (.+)\)/)
        directions[values[0].trim()] = [m[1], m[2]]
      }
    }
  }

  const doIt = (startPattern: string, endPattern: string) => {
    const positions = Object.keys(directions).filter((k: string) => k.endsWith(startPattern))
    const iterationsWhenEnd: Array<number> = []
    let it = 0

    while (iterationsWhenEnd.length < positions.length) {
      for (let j = 0; j < positions.length; j++) {
        const instructionIndex = instructions[it % instructions.length] === 'L' ? 0 : 1
        positions[j] = directions[positions[j]][instructionIndex]
        if (positions[j].endsWith(endPattern)) {
          iterationsWhenEnd.push(it + 1)
        }
      }
      it++
    }
    log.info(iterationsWhenEnd)
    return iterationsWhenEnd.reduce((a, b) => lcm(a, b), 1)
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doIt('AAA', 'ZZZ')
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = doIt('A', 'Z')
  }

  return { part1, part2 }
}
