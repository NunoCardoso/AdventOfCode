import { Params } from 'aoc.d'
import clc from 'cli-color'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Coord = 'N' | 'NW' | 'NE' | 'W' | 'E' | 'SW' | 'S' | 'SE'
  type World = { rows: number; columns: number }
  type Elf = { x: number; y: number; id: number; wants?: { x: number; y: number; d: Coord } }
  type ElfAround = { x: number; y: number; d: Coord }
  type ElfsAround = Array<ElfAround>
  type Elves = Array<Elf>

  const matrix: World = { rows: 0, columns: 0 }
  const originalElves: Elves = []
  let rowNumber: number = 0

  for await (const line of lineReader) {
    const vals = line.split('')
    matrix.columns = vals.length
    vals.forEach((val: string, columnNumber: number) => {
      if (val === '#') {
        const elf = { x: rowNumber, y: columnNumber, id: originalElves.length, wants: undefined }
        originalElves.push(elf)
      }
    })
    rowNumber++
  }
  matrix.rows = rowNumber

  const elfsAround = (elf: Elf, matrix: World, elvesKeys: Record<string, Elf>): ElfsAround => {
    const candidates: Array<[number, number, string]> = [
      [elf.x - 1, elf.y - 1, 'NW'],
      [elf.x - 1, elf.y, 'N'],
      [elf.x - 1, elf.y + 1, 'NE'],
      [elf.x, elf.y - 1, 'W'],
      [elf.x, elf.y + 1, 'E'],
      [elf.x + 1, elf.y - 1, 'SW'],
      [elf.x + 1, elf.y, 'S'],
      [elf.x + 1, elf.y + 1, 'SE']
    ]
    return _.filter(
      candidates,
      (c: [number, number, string]) =>
        c[0] >= 0 &&
        c[0] < matrix.rows &&
        c[1] >= 0 &&
        c[1] < matrix.columns &&
        Object.prototype.hasOwnProperty.call(elvesKeys, '' + c[0] + ',' + c[1])
    ).map((c: [number, number, string]) => ({ x: c[0], y: c[1], d: c[2] }) as ElfAround)
  }

  const getElfWish = (direction: string, otherElfs: ElfsAround): string => {
    const foundElfBlocking: boolean = _.find(otherElfs, (elf: ElfAround) => elf.d.indexOf(direction) >= 0) !== undefined
    return foundElfBlocking ? '' : direction
  }

  const printWorld = (matrix: World, elves: Elves) => {
    const m: Array<Array<string>> = []
    for (let i = 0; i < matrix.rows; i++) {
      m.push(new Array(matrix.columns).fill('.'))
    }
    elves.forEach((elf) => {
      m[elf.x][elf.y] = clc.red('#')
    })
    console.log(clc.cyan('+' + '-'.repeat(matrix.columns) + '+'))
    m.forEach((row: Array<string>) => console.log(clc.cyan('|') + row.join('') + clc.cyan('|')))
    console.log(clc.cyan('+' + '-'.repeat(matrix.columns) + '+'))
  }

  log.info('Initial matrix size', matrix.rows, matrix.columns)

  const order: Array<Coord> = ['N', 'S', 'W', 'E']

  const generateKeys = (elves: Elves): Record<string, Elf> => {
    const elvesKeys: Record<string, Elf> = {}
    elves.forEach((elf) => {
      elvesKeys['' + elf.x + ',' + elf.y] = elf
    })
    return elvesKeys
  }

  const runSimulation = (maxRound: number, elves: Elves, whatToReturn: string): number => {
    let round: number = 0
    let allSpaced: boolean = false
    let elvesKeys: Record<string, Elf> = generateKeys(elves)

    while (!allSpaced && round < maxRound) {
      let _allSpaced = true
      const wishedSpaces: Record<string, Elves> = {}
      const widenTheGrid: Array<Coord> = []

      for (let elfIndex = 0; elfIndex < elves.length; elfIndex++) {
        const otherElfs: ElfsAround = elfsAround(elves[elfIndex], matrix, elvesKeys)

        // check if we are done with moves by checking if one elf is not spaced
        if (_allSpaced === true && !_.isEmpty(otherElfs)) {
          _allSpaced = false
        }

        // stage 1: check if elf has a moving wish
        let elfWish: string = ''
        if (!_.isEmpty(otherElfs)) {
          wishLoop: for (let j = 0; j < order.length; j++) {
            const index = (j + round) % order.length
            elfWish = getElfWish(order[index], otherElfs)
            if (elfWish !== '') {
              break wishLoop
            }
          }

          if (elfWish !== '') {
            if (elfWish === 'N') {
              elves[elfIndex].wants = { x: elves[elfIndex].x - 1, y: elves[elfIndex].y, d: elfWish }
            }
            if (elfWish === 'W') {
              elves[elfIndex].wants = { x: elves[elfIndex].x, y: elves[elfIndex].y - 1, d: elfWish }
            }
            if (elfWish === 'S') {
              elves[elfIndex].wants = { x: elves[elfIndex].x + 1, y: elves[elfIndex].y, d: elfWish }
            }
            if (elfWish === 'E') {
              elves[elfIndex].wants = { x: elves[elfIndex].x, y: elves[elfIndex].y + 1, d: elfWish }
            }
            const key: string = '' + elves[elfIndex].wants!.x + ',' + elves[elfIndex].wants!.y
            // more than one elf may wish to go to same place
            if (!Object.prototype.hasOwnProperty.call(wishedSpaces, key)) {
              wishedSpaces[key] = [_.cloneDeep(elves[elfIndex])]
            } else {
              wishedSpaces[key].push(_.cloneDeep(elves[elfIndex]))
            }
          }
        }
      }

      Object.keys(wishedSpaces).forEach((key) => {
        // only move the ones with no conflicts
        if (wishedSpaces[key].length === 1) {
          const movedElf: Elf = wishedSpaces[key][0]
          movedElf.x = movedElf.wants!.x
          movedElf.y = movedElf.wants!.y
          // check if we need to widen the matrix
          if (movedElf.x < 0 || movedElf.x >= matrix.rows || movedElf.y < 0 || movedElf.y >= matrix.columns) {
            if (widenTheGrid.indexOf(movedElf.wants!.d) < 0) {
              widenTheGrid.push(movedElf.wants!.d)
            }
          }
          // set it on the main elves array
          elves[movedElf.id] = {
            ...movedElf,
            wants: undefined
          }
        }
      })

      // now, elves moved, let's widen the grid if necessary
      if (widenTheGrid.indexOf('N') >= 0) {
        matrix.rows += 1
        elves = elves.map((elf) => ({ ...elf, x: elf.x + 1 }))
      }
      if (widenTheGrid.indexOf('W') >= 0) {
        matrix.columns += 1
        elves = elves.map((elf) => ({ ...elf, y: elf.y + 1 }))
      }
      if (widenTheGrid.indexOf('S') >= 0) {
        matrix.rows += 1
      }
      if (widenTheGrid.indexOf('E') >= 0) {
        matrix.columns += 1
      }

      // reset the index with new moved elfs
      elvesKeys = {}
      elves.forEach((elf) => {
        elvesKeys['' + elf.x + ',' + elf.y] = _.cloneDeep(elf)
      })

      allSpaced = _allSpaced
      round++

      if (params.ui?.show && params.ui?.during) {
        console.log('round', round, 'All spaced', allSpaced)
        printWorld(matrix, elves)
      }
    }

    if (whatToReturn === 'rounds') {
      return round
    }
    const b = { minX: 10000, maxX: -10000, minY: 10000, maxY: -10000 }
    elves.forEach((elf) => {
      if (elf.x < b.minX) {
        b.minX = elf.x
      }
      if (elf.x > b.maxX) {
        b.maxX = elf.x
      }
      if (elf.y < b.minY) {
        b.minY = elf.y
      }
      if (elf.y > b.maxY) {
        b.maxY = elf.y
      }
    })
    return (b.maxX - b.minX + 1) * (b.maxY - b.minY + 1) - elves.length
  }

  let part1: number = 0
  let part2: number = 0
  if (params.part1?.skip !== true) {
    part1 = runSimulation(params!.iterations.part1, _.cloneDeep(originalElves), 'emptySpaces')
  }
  if (params.part2?.skip !== true) {
    part2 = runSimulation(params!.iterations.part2, _.cloneDeep(originalElves), 'rounds')
  }
  return {
    part1,
    part2
  }
}
