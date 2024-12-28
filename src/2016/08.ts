import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = '\n'

  const dimensions: any = params.screenSize

  const screen: World<string> = Array(dimensions.height)
    .fill(null)
    .map(() => Array(dimensions.width).fill('.'))

  log.info('Setting screen width ' + dimensions.width + ' height ' + dimensions.height)

  const printGrid = () => {
    screen.forEach((row, i) =>
      console.log(row.map((cell, j) => (screen[i][j] === '#' ? clc.blue(screen[i][j]) : screen[i][j])).join(''))
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
        const newRow = []
        for (let column = 0; column < screen[+index].length; column++) {
          const newColumnIndex = (column + +amount) % screen[+index].length
          newRow[newColumnIndex] = screen[+index][column]
        }
        screen[+index] = newRow
      }
      if (axis === 'x') {
        const newColumn = []
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

  for (let row = 0; row < screen.length; row++) {
    part1 += screen[row].filter((pixel) => pixel === '#').length
    part2 += screen[row].join('') + '\n'
  }

  return { part1, part2 }
}
