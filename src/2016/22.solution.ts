import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'

type Node = {
  size: number
  used: number
  avail: number
  perc: number
}

type Data = {
  end: Point
  bestScore: number
  path: Step[]
}

type Step = [number, number, number]

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
      world[+row][+column] = {
        size: +size,
        used: +used,
        avail: +avail,
        perc: Math.floor((+used * 100) / +size)
      }
    }
  }

  const printData = (world: World<Node>, movableNodes: Record<string, Point[]>) => {
    console.log(
      '    |' +
        new Array(world[0].length)
          .fill(null)
          .map((_, i) => i.toString().padStart(3, ' '))
          .join(' ')
    )
    console.log('='.repeat(105))
    world.forEach((row, rowIndex) => {
      let string = rowIndex.toString().padStart(3, ' ') + ' |'
      row.forEach((node, colIndex) => {
        string += node.perc.toString().padStart(3, ' ')
        let key = rowIndex + ',' + colIndex
        if (movableNodes[key] && movableNodes[key].find((p) => p[0] === rowIndex && p[1] === colIndex + 1)) {
          string += clc.cyan('→')
        } else {
          string += ' '
        }
      })
      console.log(string)
      string = '    |'
      row.forEach((node, colIndex) => {
        let key = rowIndex + ',' + colIndex
        let otherKey = rowIndex + 1 + ',' + colIndex
        let arrowDown =
          movableNodes[key] && movableNodes[key].find((p) => p[0] === rowIndex + 1 && p[1] === colIndex)
        let arrowUp =
          movableNodes[otherKey] && movableNodes[otherKey].find((p) => p[0] === rowIndex && p[1] === colIndex)
        string += clc.cyan(' ' + (arrowUp ? '↑' : ' ') + (arrowDown ? '↓' : ' ') + ' ')
      })
      console.log(string)
    })
  }

  const doSearch = (movableNodes: Array<any>, opened: Array<Point>, data: any) => {
    //TODO
    /*const point = opened.splice(-1)[0]
    if (isSame(point, data.end)) {
      if (data.lowestCost > head[3]) {
        data.lowestCost = head[3]
      }
    }*/
  }

  const isAdjacent = (row1: number, row2: number, col1: number, col2: number) =>
    (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col1) === 1 && row1 === row2)

  const movableNodes: Record<string, Point[]> = {}

  for (let row1 = 0; row1 < world.length; row1++) {
    for (let col1 = 0; col1 < world[0].length; col1++) {
      if (world[row1][col1].used > 0) {
        for (let row2 = 0; row2 < world.length; row2++) {
          for (let col2 = 0; col2 < world[0].length; col2++) {
            if (row1 !== row2 || col1 !== col2) {
              if (world[row1][col1].used <= world[row2][col2].avail) {
                part1++
                // for part2
                if (isAdjacent(row1, row2, col1, col2)) {
                  let key: string = row1 + ',' + col1
                  if (!movableNodes[key]) movableNodes[key] = []
                  movableNodes[key].push([row2, col2])
                }
              }
            }
          }
        }
      }
    }
  }

  if (!params.skipPart2) {
    const start: Point = [0, world[0].length - 1]
    const end: Point = [0, 0]
    const data: Data = { end, path: [], bestScore: Number.MAX_SAFE_INTEGER }
    const opened = [start]
    let iterations = 0

    console.log(movableNodes)
    printData(world, movableNodes)
    /*while (opened.length > 0) {
      doSearch(movableNodes, opened, data)
      if (iterations++ % 100 === 0) {
        log.debug('it', iterations, 'opened length', opened.length)
      }
    }*/
    part2 = data.path?.length
  }

  return { part1, part2 }
}
