import { Params } from 'aoc.d'
import { divisors } from '../util/divisors'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const threshold = params.threshold
  const numberOfPresentsPerElf: Map<number, number> = new Map()

  for (let i = 1; i < threshold; i++) {
    const elves = divisors(i)
    elves.forEach((elf) => {
      if (!numberOfPresentsPerElf.has(elf)) numberOfPresentsPerElf.set(elf, 1)
      if (numberOfPresentsPerElf.get(elf)! < params.maxHousePresents) {
        numberOfPresentsPerElf.set(elf, numberOfPresentsPerElf.get(elf)! + 1)
      }
    })

    const medResultPart1 = elves.reduce((acc, elf) => acc + elf, 0)
    const medResultPart2 = elves.reduce(
      (acc, elf) => acc + (numberOfPresentsPerElf.get(elf)! < params.maxHousePresents ? elf : 0),
      0
    )

    if (medResultPart1 * params.elfMultiplier.part1 >= threshold) {
      if (part1 === 0) part1 = i
      if (part2 !== 0) break
    }
    if (medResultPart2 * params.elfMultiplier.part2 >= threshold) {
      if (part2 === 0) part2 = i
      if (part1 !== 0) break
    }
  }
  return { part1, part2 }
}
