import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Cafeteria',
    year: 2025,
    day: 5,
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
      part1: 3,
      part2: 14
    }
  },
  prod: {
    answers: {
      part1: 690,
      part2: 344323629240733
    }
  }
}

export default config
