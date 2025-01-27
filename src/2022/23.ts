import { Params } from 'aoc.d'
import clc from 'cli-color'
import { BoundingBox } from 'declarations'
import { range } from 'util/range'

type Coordinates = 'N' | 'NW' | 'NE' | 'W' | 'E' | 'SW' | 'S' | 'SE'
type Elf = [row: number, y: number, id: number, wantsX?: number, wantsY?: number, coordinate?: Coordinates]
type ElfAround = [row: number, column: number, coordinate: Coordinates]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNeighborElves = (elf: Elf, boundingBox: BoundingBox, elfPosition: Set<string>): ElfAround[] =>
    (
      [
        [elf[0] - 1, elf[1] - 1, 'NW'],
        [elf[0] - 1, elf[1], 'N'],
        [elf[0] - 1, elf[1] + 1, 'NE'],
        [elf[0], elf[1] - 1, 'W'],
        [elf[0], elf[1] + 1, 'E'],
        [elf[0] + 1, elf[1] - 1, 'SW'],
        [elf[0] + 1, elf[1], 'S'],
        [elf[0] + 1, elf[1] + 1, 'SE']
      ] as ElfAround[]
    ).filter(
      (c: ElfAround) =>
        c[0] >= boundingBox[0][0] &&
        c[0] < boundingBox[1][0] &&
        c[1] >= boundingBox[0][1] &&
        c[1] < boundingBox[1][1] &&
        elfPosition.has(c[0] + ',' + c[1])
    )

  const getElfWish = (direction: string, neighborElf: ElfAround[]): string => {
    //    console.log('direction', direction, 'other', neighborElf)
    const foundElfBlocking: boolean = neighborElf.some((elf: ElfAround) => elf[2].indexOf(direction) >= 0)
    return foundElfBlocking ? '' : direction
  }

  const printWorld = (boundingBox: BoundingBox, elves: Elf[]) => {
    const world: string[][] = []
    console.log(boundingBox)
    for (let i = boundingBox[0][0]; i <= boundingBox[1][0]; i++)
      world.push(new Array(boundingBox[1][1] + 1 - boundingBox[0][1]).fill('.'))
    let compensateX = 0 - boundingBox[0][0]
    let compensateY = 0 - boundingBox[0][1]
    elves.forEach((elf) => (world[elf[0] + compensateX][elf[1] + compensateY] = clc.red('#')))
    log.info(clc.cyan('+' + '-'.repeat(boundingBox[1][1] + 1 - boundingBox[0][1]) + '+'))
    world.forEach((row: string[]) => log.info(clc.cyan('|') + row.join('') + clc.cyan('|')))
    log.info(clc.cyan('+' + '-'.repeat(boundingBox[1][1] + 1 - boundingBox[0][1]) + '+'))
  }

  const solveFor = (elves: Elf[], maxRound: number, whatToReturn: string): number => {
    let round: number = 0
    let allSpaced: boolean = false
    let elfPosition: Set<string> = new Set<string>()
    elves.forEach((elf) => elfPosition.add(elf[0] + ',' + elf[1]))
    const order: Coordinates[] = ['N', 'S', 'W', 'E']

    while (!allSpaced && round < maxRound) {
      let _allSpaced = true
      const wishedSpaces: Record<string, Elf[]> = {}

      for (let elfIndex of range(elves.length)) {
        const otherElfs: ElfAround[] = getNeighborElves(elves[elfIndex], boundingBox, elfPosition)

        // check if we are done with moves by checking if one elf is not spaced
        if (_allSpaced === true && otherElfs.length > 0) {
          _allSpaced = false
        }

        // stage 1: check if elf has a moving wish
        let elfWish: string = ''
        if (otherElfs.length > 0) {
          wishLoop: for (let j = 0; j < order.length; j++) {
            const index = (j + round) % order.length
            elfWish = getElfWish(order[index], otherElfs)
            if (elfWish !== '') {
              break wishLoop
            }
          }

          if (elfWish !== '') {
            if (elfWish === 'N') {
              elves[elfIndex][3] = elves[elfIndex][0] - 1
              elves[elfIndex][4] = elves[elfIndex][1]
              elves[elfIndex][5] = elfWish
            }
            if (elfWish === 'W') {
              elves[elfIndex][3] = elves[elfIndex][0]
              elves[elfIndex][4] = elves[elfIndex][1] - 1
              elves[elfIndex][5] = elfWish
            }
            if (elfWish === 'S') {
              elves[elfIndex][3] = elves[elfIndex][0] + 1
              elves[elfIndex][4] = elves[elfIndex][1]
              elves[elfIndex][5] = elfWish
            }
            if (elfWish === 'E') {
              elves[elfIndex][3] = elves[elfIndex][0]
              elves[elfIndex][4] = elves[elfIndex][1] + 1
              elves[elfIndex][5] = elfWish
            }
            const key: string = '' + elves[elfIndex][3] + ',' + elves[elfIndex][4]
            // more than one elf may wish to go to same place
            if (!Object.prototype.hasOwnProperty.call(wishedSpaces, key)) {
              wishedSpaces[key] = [global.structuredClone(elves[elfIndex])]
            } else {
              wishedSpaces[key].push(global.structuredClone(elves[elfIndex]))
            }
          }
        }
      }

      Object.keys(wishedSpaces).forEach((key) => {
        // only move the ones with no conflicts
        if (wishedSpaces[key].length === 1) {
          const movedElf: Elf = wishedSpaces[key][0]
          movedElf[0] = movedElf[3]!
          movedElf[1] = movedElf[4]!
          // check if we need to widen the matrix
          if (movedElf[0] < boundingBox[0][0]) boundingBox[0][0] = movedElf[0]
          if (movedElf[0] > boundingBox[1][0]) boundingBox[1][0] = movedElf[0]
          if (movedElf[1] < boundingBox[0][1]) boundingBox[0][1] = movedElf[1]
          if (movedElf[1] > boundingBox[1][1]) boundingBox[1][1] = movedElf[1]

          // set it on the main elves array, discarding its wishes
          elves[movedElf[2]] = [movedElf[0], movedElf[1], movedElf[2]]
        }
      })

      // reset the index with new moved elfs
      elfPosition.clear()
      elves.forEach((elf) => elfPosition.add(elf[0] + ',' + elf[1]))

      allSpaced = _allSpaced
      round++

      if (params.ui?.show && params.ui?.during) {
        console.log('round', round, 'All spaced', allSpaced)
        printWorld(boundingBox, elves)
      }
    }

    if (params.ui?.show && params.ui?.end) {
      console.log('round', round, 'All spaced', allSpaced)
      printWorld(boundingBox, elves)
    }

    if (whatToReturn === 'rounds') {
      return round
    }
    const b = { minX: 10000, maxX: -10000, minY: 10000, maxY: -10000 }
    elves.forEach((elf) => {
      if (elf[0] < b.minX) b.minX = elf[0]
      if (elf[0] > b.maxX) b.maxX = elf[0]
      if (elf[1] < b.minY) b.minY = elf[1]
      if (elf[1] > b.maxY) b.maxY = elf[1]
    })
    return (b.maxX - b.minX + 1) * (b.maxY - b.minY + 1) - elves.length
  }

  let rowNumber: number = 0
  const boundingBox: BoundingBox = [
    [0, 0],
    [0, 0]
  ]
  const originalElvesPart1: Elf[] = []
  const originalElvesPart2: Elf[] = []

  for await (const line of lineReader) {
    const vals = line.split('')
    boundingBox[1][1] = vals.length
    vals.forEach((val: string, columnNumber: number) => {
      if (val === '#') {
        const elf: Elf = [rowNumber, columnNumber, originalElvesPart1.length]
        originalElvesPart1.push(elf)
        originalElvesPart2.push(elf)
      }
    })
    rowNumber++
  }
  boundingBox[1][0] = rowNumber

  if (!params.skipPart1) part1 = solveFor(originalElvesPart1, params!.iterations.part1, 'emptySpaces')
  if (!params.skipPart2) part2 = solveFor(originalElvesPart2, params!.iterations.part2, 'rounds')

  return { part1, part2 }
}
