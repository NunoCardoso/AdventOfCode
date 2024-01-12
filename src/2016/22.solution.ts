import { Params } from 'aoc.d'
import { Point, World } from 'declarations'

type Node = {
  size: number
  used: number
  avail: number
}

type NodeTransfer = [Point, Point]

type Step = []

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<Node> = []
  for await (const line of lineReader) {
    if (line.startsWith('/dev')) {
      const [, row, column, size, used, avail] = line?.match(
        /\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/
      )
      if (!world[+row]) world[+row] = []
      world[+row][+column] = { size: +size, used: +used, avail: +avail }
    }
  }

  const neighborNodesWithAvailableSpace = (row: number, col: number): Array<NodeTransfer> => {
    const movableNodes: Array<NodeTransfer> = []
    if (row - 1 >= 0 && world[row - 1][col].avail >= world[row][col].used)
      movableNodes.push([
        [row, col],
        [row - 1, col]
      ])
    if (row + 1 < world.length && world[row + 1][col].avail >= world[row][col].used)
      movableNodes.push([
        [row, col],
        [row + 1, col]
      ])
    if (col - 1 >= 0 && world[row][col - 1].avail >= world[row][col].used)
      movableNodes.push([
        [row, col],
        [row, col - 1]
      ])
    if (col + 1 < world[0].length && world[row][col + 1].avail >= world[row][col + 1].used)
      movableNodes.push([
        [row, col],
        [row, col + 1]
      ])
    return movableNodes
  }

  const doSearch = (movableNodes: Array<NodeTransfer>, opened: Array<Point>, data: any) => {
    const point = opened.splice(-1)[0]
    if (isSame(point, data)) {
      if (data.lowestCost > head[3]) {
        data.lowestCost = head[3]
      }
    }
  }

  const movableNodes: Array<NodeTransfer> = []

  for (let row1 = 0; row1 < world.length; row1++) {
    for (let col1 = 0; col1 < world[0].length; col1++) {
      if (world[row1][col1].used > 0) {
        movableNodes.push(...neighborNodesWithAvailableSpace(row1, col1))
        for (let row2 = 0; row2 < world.length; row2++) {
          for (let col2 = 0; col2 < world[0].length; col2++) {
            if (row1 !== row2 || col1 !== col2) {
              if (world[row1][col1].used <= world[row2][col2].avail) part1++
            }
          }
        }
      }
    }
  }

  if (!params.skipPart2) {
    const start: Point = [0, world[0].length - 1]
    const data: any = { end: [0, 0] }
    const opened = [start]
    let iterations = 0

    while (opened.length > 0) {
      doSearch(movableNodes, opened, data)
      if (iterations++ % 100 === 0) {
        log.debug('it', iterations, 'opened length', opened.length)
      }
    }
    part2 = data.path?.length
  }

  return { part1, part2 }
}
