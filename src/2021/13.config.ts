import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2021,
    day: 13,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  ui: { show: false, during: true },
  test: {
    id: 'test',
    answers: {
      part1: 17
    }
  },
  prod: {
    answers: {
      part1: 802,
      part2: 'RKHFZGUB'
    }
  }
}

export default config
