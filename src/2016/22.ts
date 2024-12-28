import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'

type Node = {
  id: number
  size: number
  used: number
  avail: number
}

type Move = [Point, Point]

type Data = {
  endLocation: Point
  bestScore: number
  path: Step[]
}

type Step = {
  score: number
  dataNodeLocation: Point
  emptyNodeLocation: Point
  distance: number
  move?: Move
  path: Step[]
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<Node> = []

  let id: number = 0
  for await (const line of lineReader) {
    if (line.startsWith('/dev')) {
      const [, row, column, size, used, avail] = line?.match(/\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/)
      if (!world[+row]) world[+row] = []
      world[+row][+column] = {
        id: id++,
        size: +size,
        used: +used,
        avail: +avail
      }
    }
  }

  const printData = (world: World<Node>, moves: Move[]) => {
    console.log(moves)
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
        let perc = Math.floor((+node.used * 100) / +node.size)
        string += perc.toString().padStart(3, ' ')
        let key = rowIndex + ',' + colIndex
        let arrowLeft = moves.find((m) => m[0][0] === rowIndex && m[0][1] === colIndex && m[1][0] === rowIndex && m[1][1] === colIndex + 1)
        let arrowRight = moves.find((m) => m[1][0] === rowIndex && m[1][1] === colIndex && m[0][0] === rowIndex && m[0][1] === colIndex + 1)
        if (arrowLeft) {
          string += arrowRight ? clc.cyan('↔') : clc.cyan('→')
        }
        if (arrowRight) {
          string += arrowLeft ? clc.cyan('↔') : clc.cyan('←')
        }
        if (!arrowLeft && !arrowRight) string += ' '
      })
      console.log(string)
      string = '    |'
      row.forEach((node, colIndex) => {
        let key = rowIndex + ',' + colIndex
        let otherKey = rowIndex + 1 + ',' + colIndex
        let arrowDown = !!moves.find((m) => m[0][0] === rowIndex && m[0][1] === colIndex && m[1][0] === rowIndex + 1 && m[1][1] === colIndex)
        let arrowUp = moves.find((m) => m[1][0] === rowIndex && m[1][1] === colIndex && m[0][0] === rowIndex + 1 && m[0][1] === colIndex)
        string += clc.cyan(' ' + (arrowUp ? '↑' : ' ') + (arrowDown ? '↓' : ' ') + ' ')
      })
      console.log(string)
    })
  }

  const isAdjacent = (row1: number, row2: number, col1: number, col2: number) => (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2)

  const initialMoves: Move[] = []

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
                  initialMoves.push([
                    [row1, col1],
                    [row2, col2]
                  ])
                }
              }
            }
          }
        }
      }
    }
  }

  const doSearch = (opened: Step[], data: Data) => {
    const head = opened.splice(-1)[0]
    if (isSame(data.endLocation, head.dataNodeLocation)) {
    }
    head.possibleMoves?.forEach((move) => {
      head.score++
    })
  }

  const getManhattanDistance = (p1: Point, p2: Point) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])

  // if the empty node is not next to the data node, add *100 to the distance so it is always worse than
  // distances from the data node to the end node
  const getDistance = (emptyNodeLocation: Point, dataNodeLocation: Point, endLocation: Point) => {
    let firstManhattanDistance = getManhattanDistance(emptyNodeLocation, dataNodeLocation)
    if (firstManhattanDistance > 1) {
      return firstManhattanDistance * 100
    }
    return getManhattanDistance(dataNodeLocation, endLocation)
  }

  if (!params.skipPart2) {
    const data: Data = {
      endLocation: [0, 0],
      path: [],
      bestScore: Number.MAX_SAFE_INTEGER
    }

    let iterations = 0
    let opened: Step[] = [
      {
        score: 0,
        distance: 0,
        emptyNodeLocation: initialMoves[0][0],
        dataNodeLocation: [0, world[0].length - 1],
        path: []
      }
    ]
    opened[0].distance = getDistance(opened[0].emptyNodeLocation, opened[0].dataNodeLocation, data.endLocation)
    printData(world, initialMoves)
    while (opened.length > 0) {
      doSearch(opened, data)
      if (iterations++ % 100 === 0) {
        log.debug('it', iterations, 'opened length', opened.length)
      }
    }
    part2 = data.path?.length
  }

  return { part1, part2 }
}
