import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = '\n'

  const dimension: Dimension = params.screenSize

  const screen: World<string> = Array(dimension[0])
    .fill(null)
    .map(() => Array(dimension[1]).fill('.'))

  const printGrid = () => {
    screen.forEach((row, i) =>
      log.info(row.map((cell, j) => (screen[i][j] === '#' ? clc.blue(screen[i][j]) : screen[i][j])).join(''))
    )
  }

  for await (const line of lineReader) {
    if (line.startsWith('rect')) {
      const [width, height] = line.match(/\d+/g).map(Number)
      for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
          screen[row][column] = '#'
        }
      }
    }
    if (line.startsWith('rotate')) {
      const [, axis, index, amount] = line.match(/rotate .+ (.)=(\d+) by (\d+)/)
      if (axis === 'y') {
        const newRow: string[] = []
        for (let column = 0; column < screen[+index].length; column++) {
          const newColumnIndex = (column + +amount) % screen[+index].length
          newRow[newColumnIndex] = screen[+index][column]
        }
        screen[+index] = newRow
      }
      if (axis === 'x') {
        const newColumn: string[] = []
        for (let row = 0; row < screen.length; row++) {
          const newRowIndex = (row + +amount) % screen.length
          newColumn[newRowIndex] = screen[row][+index]
        }
        for (let row = 0; row < screen.length; row++) {
          screen[row][+index] = newColumn[row]
        }
      }
    }

    if (params.ui.show && params.ui.during) printGrid()
  }

  if (params.ui.show && params.ui.end) printGrid()

  screen.forEach((row) => {
    part1 += row.filter((pixel) => pixel === '#').length
    part2 += row.join('') + '\n'
  })

  return { part1, part2 }
}
