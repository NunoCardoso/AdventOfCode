import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const solveFor = (elvesNumber: number, mode: string): number => {
    let elf = 1
    for (let i = 1; i <= elvesNumber; i++) {
      if (mode === 'part1') {
        if (elf + 2 > i) elf = 1
        else elf += 2
      }
      if (mode === 'part2') {
        if (elf >= i - 1 - elf) elf += 2
        else elf += 1
        if (elf > i) elf = 1
      }
    }
    return elf
  }

  part1 = solveFor(params.elves, 'part1')
  part2 = solveFor(params.elves, 'part2')

  return { part1, part2 }
}
