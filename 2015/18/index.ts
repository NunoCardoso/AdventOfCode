import clc from 'cli-color'
import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  type Grid = Array<Array<string>>
  let part1: number = 0; let part2: number = 0

  const grid: Grid = []
  for await (const line of lineReader) {
    grid.push(line.split(''))
  }

  const printGrid = (grid: Grid, iteration: string | number) => {
    console.log('iteration', iteration)
    grid.forEach(row => {
      const line = row.join('')
      console.log(line.replaceAll('#', clc.red('#')))
    })
  }

  const calculateNumberOfLights = (grid: Grid, x: number, y: number) => {
    let total: number = 0
    if (x > 0 && y > 0) total += grid[x - 1][y - 1] === '#' ? 1 : 0
    if (x > 0) total += grid[x - 1][y] === '#' ? 1 : 0
    if (x > 0 && y < grid[0].length - 1) total += grid[x - 1][y + 1] === '#' ? 1 : 0

    if (y > 0) total += grid[x][y - 1] === '#' ? 1 : 0
    if (y < grid[0].length - 1) total += grid[x][y + 1] === '#' ? 1 : 0

    if (x < grid.length - 1 && y > 0) total += grid[x + 1][y - 1] === '#' ? 1 : 0
    if (x < grid.length - 1) total += grid[x + 1][y] === '#' ? 1 : 0
    if (x < grid.length - 1 && y < grid[0].length - 1) total += grid[x + 1][y + 1] === '#' ? 1 : 0
    return total
  }

  const makeCornersOn = (grid: Grid) => {
    grid[0][0] = '#'
    grid[grid.length - 1][0] = '#'
    grid[0][grid[0].length - 1] = '#'
    grid[grid.length - 1][grid[0].length - 1] = '#'
  }

  const flipIt = (grid: Grid, limit: number, cornerStuck: boolean) => {
    let _grid: Grid = grid
    let iteration: number = 0
    while (iteration < limit) {
      const _newGrid: Grid = []
      for (let x = 0; x < _grid.length; x++) {
        const newRow: Array<string> = []
        for (let y = 0; y < _grid[x].length; y++) {
          const numberOfLights = calculateNumberOfLights(_grid, x, y)
          if (_grid[x][y] === '#') {
            newRow.push((numberOfLights === 2 || numberOfLights === 3) ? '#' : '.')
          } else {
            newRow.push((numberOfLights === 3) ? '#' : '.')
          }
        }
        _newGrid.push(newRow)
      }
      _grid = _newGrid
      if (cornerStuck) {
        makeCornersOn(_grid)
      }
      if (params.ui?.show && params.ui?.during) {
        printGrid(_grid, iteration)
      }
      iteration++
    }

    if (params.ui?.show && params.ui?.end) {
      printGrid(_grid, 'end')
    }
    return _grid
  }

  if (params.part1?.skip !== true) {
    let grid1 = _.cloneDeep(grid)
    grid1 = flipIt(grid1, params.limit, false)
    part1 = _.reduce(grid1, (memo, row) =>
      (memo + _.filter(row, (cell) => cell === '#').length), 0)
  }

  if (params.part2?.skip !== true) {
    let grid2 = _.cloneDeep(grid)
    makeCornersOn(grid2)
    grid2 = flipIt(grid2, params.limit, true)
    part2 = _.reduce(grid2, (memo, row) =>
      (memo + _.filter(row, (cell) => cell === '#').length), 0)
  }

  return {
    part1,
    part2
  }
}
