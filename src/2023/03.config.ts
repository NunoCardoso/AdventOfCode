import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 3,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  ui: {
    show: true
  },
  test: {
    id: 'test',
    answers: {
      part1: 4361,
      part2: 467835
    }
  },
  prod: {
    answers: {
      part1: 521515,
      part2: 69527306
    }
  }
}

export default config
