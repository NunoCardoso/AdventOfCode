import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Chronal Coordinates',
    year: 2018,
    day: 6,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      threshold: 32
    },
    answers: {
      part1: 17,
      part2: 16
    }
  },
  prod: {
    params: {
      threshold: 10000
    },
    answers: {
      part1: 5532,
      part2: 36216
    }
  }
}

export default config
