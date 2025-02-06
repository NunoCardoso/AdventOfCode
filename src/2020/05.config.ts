import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Binary Boarding',
    year: 2020,
    day: 5,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 357
    }
  },
  prod: {
    answers: {
      part1: 951,
      part2: 653
    }
  }
}

export default config
