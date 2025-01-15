import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 12,
    title: 'Hill Climbing Algorithm',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'This is the cleanest, simplest Dijkstra algorithm implementation from all puzzles',
    tags: ['Dijkstra']
  },
  ui: {
    show: true,
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
