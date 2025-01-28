import { Params } from 'aoc.d'
import clc from 'cli-color'
import { BoundingBox, Location } from 'declarations'
import { fromKey, getKey } from 'util/location'
import { range } from 'util/range'

type Coordinates = 'N' | 'NW' | 'NE' | 'W' | 'E' | 'SW' | 'S' | 'SE'
type Elf = Location
type ElfMap = Record<string, Elf>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNeighborElves = (elfMap: ElfMap, elf: Elf): Elf[] =>
    (
      [
        [elf[0] - 1, elf[1] - 1],
        [elf[0] - 1, elf[1]],
        [elf[0] - 1, elf[1] + 1],
        [elf[0], elf[1] - 1],
        [elf[0], elf[1] + 1],
        [elf[0] + 1, elf[1] - 1],
        [elf[0] + 1, elf[1]],
        [elf[0] + 1, elf[1] + 1]
      ] as Location[]
    )
      .filter((l: Location) => !!elfMap[getKey(l)])
      .map((l) => elfMap[getKey(l)])

  const fillCandidateMoves = (
    elf: Elf,
    neighborElf: Elf[],
    iteration: number,
    candidateMoves: Record<string, Elf[]>
  ) => {
    const directionOrder: Coordinates[] = ['N', 'S', 'W', 'E']

    for (let orderIndex of range(directionOrder.length)) {
      const index = (orderIndex + iteration) % directionOrder.length
      if (directionOrder[index] === 'N') {
        if (neighborElf.every((nElf) => nElf[0] !== elf[0] - 1)) {
          let newElfKey = getKey([elf[0] - 1, elf[1]])
          if (!candidateMoves[newElfKey]) candidateMoves[newElfKey] = []
          candidateMoves[newElfKey].push(elf)
          break
        }
      } else if (directionOrder[index] === 'S') {
        if (neighborElf.every((nElf) => nElf[0] !== elf[0] + 1)) {
          let newElfKey = getKey([elf[0] + 1, elf[1]])
          if (!candidateMoves[newElfKey]) candidateMoves[newElfKey] = []
          candidateMoves[newElfKey].push(elf)
          break
        }
      } else if (directionOrder[index] === 'W') {
        if (neighborElf.every((nElf) => nElf[1] !== elf[1] - 1)) {
          let newElfKey = getKey([elf[0], elf[1] - 1])
          if (!candidateMoves[newElfKey]) candidateMoves[newElfKey] = []
          candidateMoves[newElfKey].push(elf)
          break
        }
      } else if (directionOrder[index] === 'E') {
        if (neighborElf.every((nElf) => nElf[1] !== elf[1] + 1)) {
          let newElfKey = getKey([elf[0], elf[1] + 1])
          if (!candidateMoves[newElfKey]) candidateMoves[newElfKey] = []
          candidateMoves[newElfKey].push(elf)
          break
        }
      }
    }
  }

  const getBoundingBox = (elfMap: ElfMap): BoundingBox => {
    let bbox: BoundingBox = [
      [Number.MAX_VALUE, Number.MAX_VALUE],
      [Number.MIN_VALUE, Number.MIN_VALUE]
    ]
    Object.values(elfMap).forEach((elf) => {
      if (elf[0] < bbox[0][0]) bbox[0][0] = elf[0]
      if (elf[0] > bbox[1][0]) bbox[1][0] = elf[0]
      if (elf[1] < bbox[0][1]) bbox[0][1] = elf[1]
      if (elf[1] > bbox[1][1]) bbox[1][1] = elf[1]
    })
    return bbox
  }

  const printWorld = (elfMap: ElfMap) => {
    const world: string[][] = []
    const boundingBox: BoundingBox = getBoundingBox(elfMap)
    for (let i = boundingBox[0][0]; i <= boundingBox[1][0]; i++)
      world.push(new Array(boundingBox[1][1] + 1 - boundingBox[0][1]).fill('.'))
    let compensateX = 0 - boundingBox[0][0]
    let compensateY = 0 - boundingBox[0][1]
    Object.values(elfMap).forEach((elf) => (world[elf[0] + compensateX][elf[1] + compensateY] = clc.red('#')))
    log.info(clc.cyan('+' + '-'.repeat(boundingBox[1][1] + 1 - boundingBox[0][1]) + '+'))
    world.forEach((row: string[]) => log.info(clc.cyan('|') + row.join('') + clc.cyan('|')))
    log.info(clc.cyan('+' + '-'.repeat(boundingBox[1][1] + 1 - boundingBox[0][1]) + '+'))
  }

  const elfMap: ElfMap = {}
  let rowNumber: number = 0
  for await (const line of lineReader) {
    line.split('').forEach((val: string, columnNumber: number) => {
      if (val === '#') {
        const elf: Elf = [rowNumber, columnNumber]
        elfMap[getKey(elf)] = elf
      }
    })
    rowNumber++
  }

  let iteration: number = 0
  let thereIsAMove: boolean | undefined = undefined

  do {
    let candidateMoves: Record<string, Elf[]> = {}
    thereIsAMove = false
    for (let elfIndex of Object.keys(elfMap)) {
      let elf = elfMap[elfIndex]
      const neighborElves: Elf[] = getNeighborElves(elfMap, elf)
      // stage 1: check if elf has a moving wish
      if (neighborElves.length > 0) fillCandidateMoves(elf, neighborElves, iteration, candidateMoves)
    }

    Object.keys(candidateMoves).forEach((key) => {
      // only move the ones with no conflicts
      if (candidateMoves[key].length === 1) {
        // delete old position, add new position
        let oldElfKey = getKey(candidateMoves[key][0])
        delete elfMap[oldElfKey]
        elfMap[key] = fromKey(key)
        if (!thereIsAMove) thereIsAMove = true
      }
    })

    iteration++
    if (iteration === params.iterations.part1) {
      let bbox = getBoundingBox(elfMap)
      part1 = (bbox[1][0] + 1 - bbox[0][0]) * (bbox[1][1] + 1 - bbox[0][1]) - Object.keys(elfMap).length
    }

    if (params.ui?.show && params.ui?.during) {
      log.info('round', iteration)
      printWorld(elfMap)
    }
  } while (thereIsAMove)

  part2 = iteration

  if (params.ui?.show && params.ui?.end) {
    log.info('round', iteration)
    printWorld(elfMap)
  }

  return { part1, part2 }
}
