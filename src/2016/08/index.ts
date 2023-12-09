import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Matrix } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0

  const dimensions: any = params.screenSize

  const screen: Matrix<string> = Array(dimensions.height)
    .fill(null)
    .map(() => Array(dimensions.width).fill('.'))

  log.info('Setting screen width ' + dimensions.width + ' height ' + dimensions.height)

  const printGrid = () => {
    screen.forEach((row, i) => {
      let line = ''
      row.forEach((cell, j) => {
        if (screen[i][j] === '#') {
          line += clc.blue(screen[i][j])
        } else {
          line += screen[i][j]
        }
      })
      console.log(line)
    })
    console.log('\n')
  }

  for await (const line of lineReader) {
    if (line.startsWith('rect')) {
      const m = line.match(/rect (\d+)x(\d+)/)
      const width = parseInt(m[1])
      const height = parseInt(m[2])
      for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
          screen[row][column] = '#'
        }
      }
    }
    if (line.startsWith('rotate')) {
      const m = line.match(/rotate (.+) (.)=(\d+) by (\d+)/)
      if (m[1] === 'row') {
        const rowIndex = parseInt(m[3])
        const increment = parseInt(m[4])
        const newRow = []
        for (let column = 0; column < screen[rowIndex].length; column++) {
          const newColumnIndex = (column + increment) % screen[rowIndex].length
          newRow[newColumnIndex] = screen[rowIndex][column]
        }
        screen[rowIndex] = newRow
      }
      if (m[1] === 'column') {
        const columnIndex = parseInt(m[3])
        const increment = parseInt(m[4])
        const newColumn = []
        for (let row = 0; row < screen.length; row++) {
          const newRowIndex = (row + increment) % screen.length
          newColumn[newRowIndex] = screen[row][columnIndex]
        }
        for (let row = 0; row < screen.length; row++) {
          screen[row][columnIndex] = newColumn[row]
        }
      }
    }

    if (params.ui.show && params.ui.during) {
      printGrid()
    }
  }

  if (params.ui.show && params.ui.end) {
    printGrid()
  }

  for (let row = 0; row < screen.length; row++) {
    for (let column = 0; column < screen[row].length; column++) {
      if (screen[row][column] === '#') {
        part1++
      }
    }
  }

  return { part1, part2: 'ZFHFSFOGPO' }
}
