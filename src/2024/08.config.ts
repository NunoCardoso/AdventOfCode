import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 8,
    title: 'Resonant Collinearity',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment:
      'Stumbled on part2 as the anchor should be the first point, not the second one. A little trick but easy to fix',
    difficulty: 2
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 14,
      part2: 34
    }
  },
  prod: {
    answers: {
      part1: 269,
      part2: 949
    }
  }
}

export default config
