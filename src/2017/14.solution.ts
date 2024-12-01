import { Params } from 'aoc.d'
import { Hex2Bin } from '../util/conv'
import { knotHash } from './10.solution'
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let hash: string = ''
  for await (const line of lineReader) hash = line

  let activeSquares: Set<string> = new Set()
  for (var y = 0; y < params.size; y++) {
    knotHash(hash + '-' + y)
      .split('')
      .map((x) => Hex2Bin(x).toString().padStart(4, '0'))
      .join('')
      .split('')
      .forEach((cell, x) => {
        if (cell === '1') {
          if (!params.skipPart1) part1++
          if (!params.skipPart2) activeSquares.add(x + ':' + y)
        }
      })
  }

  const getMoreSquares = (value: string, currentGroup: Set<string>): string[] => {
    let seedValueCoords = value.split(':').map(Number)
    return [
      [seedValueCoords[0] + 1, seedValueCoords[1]],
      [seedValueCoords[0] - 1, seedValueCoords[1]],
      [seedValueCoords[0], seedValueCoords[1] + 1],
      [seedValueCoords[0], seedValueCoords[1] - 1]
    ]
      .filter(
        (value) =>
          value[0] >= 0 &&
          value[0] < params.size &&
          value[1] >= 0 &&
          value[1] < params.size &&
          !currentGroup.has(value[0] + ':' + value[1]) &&
          activeSquares.has(value[0] + ':' + value[1])
      )
      .map((value) => value[0] + ':' + value[1])
  }

  const findGroupForSquare = (seedValue: string): Set<string> => {
    let opened = [seedValue]
    let currentGroup: Set<string> = new Set()
    currentGroup.add(seedValue)
    while (opened.length > 0) {
      let current = opened.splice(-1)[0]
      currentGroup.add(current)
      opened = opened.concat(getMoreSquares(current, currentGroup))
    }
    return currentGroup
  }

  if (!params.skipPart2) {
    let numberOfGroups = 0
    while (activeSquares.size > 0) {
      let seedSquare = [...activeSquares].shift()!
      findGroupForSquare(seedSquare).forEach((square) => activeSquares.delete(square))
      numberOfGroups++
    }
    part2 = numberOfGroups
  }

  return { part1, part2 }
}
