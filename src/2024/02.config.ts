import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 2,
    title: 'Red-Nosed Reports',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Nice, simple check of slope while reading input',
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 2,
      part2: 4
    }
  },
  prod: {
    answers: {
      part1: 472,
      part2: 520
    }
  }
}

export default config
