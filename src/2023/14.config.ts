import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 14,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  params: {
    cycles: 1000000000
  },
  test: {
    id: 'test',
    answers: {
      part1: 136,
      part2: 64
    }
  },
  prod: {
    answers: {
      part1: 110565,
      part2: 89845
    }
  }
}

export default config
