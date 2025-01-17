import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 12,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 21,
      part2: 525152
    }
  },
  prod: {
    answers: {
      part1: 7922,
      part2: 18093821750095
    }
  }
}

export default config
