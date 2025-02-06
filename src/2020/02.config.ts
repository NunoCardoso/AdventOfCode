import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Password Philosophy',
    year: 2020,
    day: 2,
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
      part1: 2,
      part2: 1
    }
  },
  prod: {
    answers: {
      part1: 572,
      part2: 306
    }
  }
}

export default config
