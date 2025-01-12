import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Memory Reallocation',
    year: 2017,
    day: 6,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Turned out not complicated, just making a math to avoid several array runs',
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 5,
      part2: 4
    }
  },
  prod: {
    answers: {
      part1: 14029,
      part2: 2765
    }
  }
}

export default config
