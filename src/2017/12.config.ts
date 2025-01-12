import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Digital Plumber',
    year: 2017,
    day: 12,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Fun, good time trying to make sure I do not duplicate code',
    difficulty: 2
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 6,
      part2: 2
    }
  },
  prod: {
    answers: {
      part1: 115,
      part2: 221
    }
  }
}

export default config
