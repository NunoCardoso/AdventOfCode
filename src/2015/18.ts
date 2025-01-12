import { Params } from 'aoc.d'
import { Grid } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const grid1: Grid<string> = [],
    grid2: Grid<string> = []
  for await (const line of lineReader) {
    grid1.push(line.split(''))
    grid2.push(line.split(''))
  }

  const printGrid = (grid: Grid<string>, iteration: string | number) => {
    log.info('iteration', iteration)
    grid.forEach((row) => log.info(row.join('').replaceAll('#', '⬜').replaceAll('.', '⬛')))
  }

  const calculateNumberOfLights = (grid: Grid<string>, row: number, col: number) => {
    let total: number = 0
    if (row > 0 && col > 0) total += grid[row - 1][col - 1] === '#' ? 1 : 0
    if (row > 0) total += grid[row - 1][col] === '#' ? 1 : 0
    if (row > 0 && col < grid[0].length - 1) total += grid[row - 1][col + 1] === '#' ? 1 : 0
    if (col > 0) total += grid[row][col - 1] === '#' ? 1 : 0
    if (col < grid[0].length - 1) total += grid[row][col + 1] === '#' ? 1 : 0
    if (row < grid.length - 1 && col > 0) total += grid[row + 1][col - 1] === '#' ? 1 : 0
    if (row < grid.length - 1) total += grid[row + 1][col] === '#' ? 1 : 0
    if (row < grid.length - 1 && col < grid[0].length - 1) total += grid[row + 1][col + 1] === '#' ? 1 : 0
    return total
  }

  const makeCornersOn = (grid: Grid<string>) => {
    grid[0][0] = '#'
    grid[grid.length - 1][0] = '#'
    grid[0][grid[0].length - 1] = '#'
    grid[grid.length - 1][grid[0].length - 1] = '#'
  }

  const solveFor = (grid: Grid<string>, limit: number, cornerStuck: boolean) => {
    if (cornerStuck) makeCornersOn(grid)
    let iteration: number = 0
    while (iteration < limit) {
      grid = grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const numberOfLights = calculateNumberOfLights(grid, rowIndex, colIndex)
          return grid[rowIndex][colIndex] === '#'
            ? numberOfLights === 2 || numberOfLights === 3
              ? '#'
              : '.'
            : numberOfLights === 3
              ? '#'
              : '.'
        })
      )
      if (cornerStuck) makeCornersOn(grid)
      if (params.ui?.show && params.ui?.during) printGrid(grid, iteration)
      iteration++
    }
    if (params.ui?.show && params.ui?.end) printGrid(grid, 'end')
    return grid.reduce((acc, row) => acc + row.filter((cell) => cell === '#').length, 0)
  }

  part1 = solveFor(grid1, params.limit, false)
  part2 = solveFor(grid2, params.limit, true)

  return { part1, part2 }
}
