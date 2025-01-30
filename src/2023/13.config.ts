import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Point of Incidence',
    year: 2023,
    day: 13,
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
