import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 24,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      from: 7,
      to: 27
    },
    answers: {
      part1: 2,
      part2: 47
    }
  },
  prod: {
    params: {
      from: 200000000000000,
      to: 400000000000000
    },
    answers: {
      part1: 16050,
      part2: 0
    }
  }
}

export default config
