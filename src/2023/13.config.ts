import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 13,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 405,
      part2: 400
    }
  },
  prod: {
    answers: {
      part1: 27300,
      part2: 29276
    }
  }
}

export default config
