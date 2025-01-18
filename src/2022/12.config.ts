import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Hill Climbing Algorithm',
    year: 2022,
    day: 12,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    tags: ['Dijkstra', 'Path-finding'],
    difficulty: 3
  },
  // mode: 'fastest',
  ui: {
    show: false,
    end: true
  },
  test: {
    id: 'test',
    answers: {
      part1: 31,
      part2: 29
    }
  },
  prod: {
    answers: {
      part1: 412,
      part2: 402
    }
  }
}

export default config
