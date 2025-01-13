import { Params } from 'aoc.d'
import { Location } from 'declarations'
import { range } from 'util/range'
import { hex2bin } from '../util/conversion'
import { knotHash } from './10'
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const getMoreSquares = (value: string, currentGroup: Set<string>): string[] => {
    let seedValueLocation: Location = value.split(':').map(Number) as Location
    return [
      [seedValueLocation[0] + 1, seedValueLocation[1]],
      [seedValueLocation[0] - 1, seedValueLocation[1]],
      [seedValueLocation[0], seedValueLocation[1] + 1],
      [seedValueLocation[0], seedValueLocation[1] - 1]
    ]
      .filter(
        (location) =>
          location[0] >= 0 &&
          location[0] < params.size &&
          location[1] >= 0 &&
          location[1] < params.size &&
          !currentGroup.has(location[0] + ':' + location[1]) &&
          activeSquares.has(location[0] + ':' + location[1])
      )
      .map((value) => value[0] + ':' + value[1])
  }

  const findGroupForSquare = (seedValue: string): Set<string> => {
    let opened = [seedValue]
    let currentGroup: Set<string> = new Set()
    currentGroup.add(seedValue)
    while (opened.length > 0) {
      let current = opened.pop()!
      currentGroup.add(current)
      opened = opened.concat(getMoreSquares(current, currentGroup))
    }
    return currentGroup
  }

  let hash: string = ''
  for await (const line of lineReader) hash = line

  let activeSquares: Set<string> = new Set()

  for (let row of range(params.size)) {
    knotHash(hash + '-' + row)
      .split('')
      .map((x) => hex2bin(x).toString().padStart(4, '0'))
      .join('')
      .split('')
      .forEach((cell, col) => {
        if (cell === '1') {
          part1++
          activeSquares.add(row + ':' + col)
        }
      })
  }

  let numberOfGroups = 0
  while (activeSquares.size > 0) {
    let seedSquare = [...activeSquares].shift()!
    findGroupForSquare(seedSquare).forEach((square) => activeSquares.delete(square))
    numberOfGroups++
  }
  part2 = numberOfGroups

  return { part1, part2 }
}
