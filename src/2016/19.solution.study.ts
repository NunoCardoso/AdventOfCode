import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const studyPatternFor = (elvesNumber: number, mode: string): number => {
    const elves = Array.from({ length: elvesNumber }, (_, index) => ({
      elf: index + 1,
      presents: 1
    }))
    let index = 0
    while (elves.length > 1) {
      let nextIndex
      if (mode === 'part1') {
        nextIndex = (index + 1) % elves.length
      } else {
        nextIndex = (index + Math.floor(elves.length / 2)) % elves.length
      }
      log.debug(
        'elves',
        elves.length,
        'index',
        index,
        'nextIndex',
        nextIndex,
        'elf',
        elves[index]?.elf,
        'got',
        elves[nextIndex]?.presents,
        'presents from elf',
        elves[nextIndex]?.elf
      )
      elves[index].presents += elves[nextIndex].presents
      elves.splice(nextIndex, 1)
      if (mode === 'part1') {
        index = nextIndex % elves.length
      } else {
        if (nextIndex < index) {
          // splice occurred before the index, so it needs to be compensated
          index = index % elves.length
        } else {
          index = (index + 1) % elves.length
        }
      }
    }
    return elves[0].elf
  }

  const solveFor = (elvesNumber: number, mode: string): number => {
    let elf = 1

    for (let i = 1; i <= elvesNumber; i++) {
      if (mode === 'part1') {
        if (elf + 2 > i) {
          elf = 1
        } else {
          elf += 2
        }
      }
      if (mode === 'part2') {
        if (elf >= i - 1 - elf) {
          elf += 2
        } else {
          elf += 1
        }
        if (elf > i) {
          elf = 1
        }
      }
    }
    return elf
  }

  if (!params.skipPart1) {
    // study the pattern with first 100
    // pattern is: odd numbers go up on steps +2 until it matches the number of elves, then resets to 1 again

    // numElves: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
    // winElf:   1 1 3 1 3 5 7 1 3 5  7  9  11 13 15 1  3
    for (let i = 1; i < 100; i++) {
      log.info('i', i, 'solution using brute force', studyPatternFor(i, 'part1'))
      log.info('i', i, 'solution using pattern', solveFor(i, 'part1'))
    }
    part1 = 0
  }

  if (!params.skipPart2) {
    // study the pattern with first 100
    // pattern is: simple progression until reach elves.number/2, then it's steps +2 until
    //  it matches the number of elves, then resets to 1 again

    // numElves: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19
    // winElf:   1 1 3 1 2 3 5 7 9 1  2  3  4  5  6  7  8  9  11

    for (let i = 1; i < 100; i++) {
      log.info('i', i, 'solution using brute force', studyPatternFor(i, 'part2'))
      log.info('i', i, 'solution using pattern', solveFor(i, 'part2'))
    }
    part2 = 0
  }

  return { part1, part2 }
}
