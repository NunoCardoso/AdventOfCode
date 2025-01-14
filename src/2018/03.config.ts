import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'No Matter How You Slice It',
    year: 2018,
    day: 3,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      size: 10
    },
    answers: {
      part1: 4,
      part2: 3
    }
  },
  prod: {
    params: {
      size: 1000
    },
    answers: {
      part1: 117948,
      part2: 567
    }
  }
}

export default config
