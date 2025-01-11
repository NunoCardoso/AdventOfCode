import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'A Maze of Twisty Little Cubicles',
    year: 2016,
    day: 13,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2,
    tags: ['Dijkstra']
  },
  logLevel: 'info',
  mode: 'fastest',
  test: {
    id: 'test',
    params: {
      designerNumber: 10,
      target: [7, 4]
    },
    answers: {
      part1: 11
    }
  },
  prod: {
    params: {
      designerNumber: 1350,
      target: [31, 39],
      cutoff: 50
    },
    answers: {
      part1: 92,
      part2: 124
    }
  }
}

export default config
