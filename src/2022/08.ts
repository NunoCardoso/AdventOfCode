import { Params } from 'aoc.d'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const trees: World = []
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) trees.push(line.split(''))

  for (let row = 0; row < trees.length; row++) {
    for (let column = 0; column < trees[row].length; column++) {
      if (row === 0 || column === 0 || row === trees.length - 1 || column === trees[row].length - 1) {
        part1++ // edge trees are always visible
        continue
      }
      // left, right, top, bottom
      const treesAreVisible: boolean[] = [true, true, true, true]
      const treeScore: number[] = [0, 0, 0, 0]
      for (let cursor = column - 1; cursor >= 0; cursor--) {
        treeScore[0]++
        if (trees[row][cursor] >= trees[row][column]) {
          treesAreVisible[0] = false
          break
        }
      }
      for (let cursor = column + 1; cursor < trees[row].length; cursor++) {
        treeScore[1]++
        if (trees[row][cursor] >= trees[row][column]) {
          treesAreVisible[1] = false
          break
        }
      }
      for (let cursor = row - 1; cursor >= 0; cursor--) {
        treeScore[2]++
        if (trees[cursor][column] >= trees[row][column]) {
          treesAreVisible[2] = false
          break
        }
      }
      for (let cursor = row + 1; cursor < trees.length; cursor++) {
        treeScore[3]++
        if (trees[cursor][column] >= trees[row][column]) {
          treesAreVisible[3] = false
          break
        }
      }
      if (treesAreVisible.some((v: boolean) => v)) part1++
      const totalTreeScore = treeScore.reduce((a, b) => a * b, 1)
      if (totalTreeScore > part2) part2 = totalTreeScore
    }
  }

  return { part1, part2 }
}
