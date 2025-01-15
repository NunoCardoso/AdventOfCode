import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 5,
    title: 'Print queue',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment:
      'I think I got lucky in guessing that a simple sort will get me the right order, so I did not overcomplicate',
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 143,
      part2: 123
    }
  },
  prod: {
    answers: {
      part1: 5713,
      part2: 5180
    }
  }
}

export default config
