import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 22,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 5,
      part2: 7
    }
  },
  prod: {
    answers: {
      part1: 395,
      part2: 64714
    }
  }
}

export default config
