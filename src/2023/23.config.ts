import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 23,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 94,
      part2: 154
    }
  },
  prod: {
    answers: {
      part1: 2050,
      part2: 0
    }
  }
}

export default config
