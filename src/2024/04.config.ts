import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 4,
    title: 'Ceres Search',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Quite simple check from pivot letters',
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 18,
      part2: 9
    }
  },
  prod: {
    answers: {
      part1: 2603,
      part2: 1965
    }
  }
}

export default config
