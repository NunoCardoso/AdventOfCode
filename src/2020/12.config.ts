import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Rain Risk',
    year: 2020,
    day: 12,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 25,
      part2: 286
    }
  },
  prod: {
    answers: {
      part1: 1565,
      part2: 78883
    }
  }
}

export default config
