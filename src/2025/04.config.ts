import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Printing Department',
    year: 2025,
    day: 4,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 13,
      part2: 43
    }
  },
  prod: {
    answers: {
      part1: 1508,
      part2: 8538
    }
  }
}

export default config
