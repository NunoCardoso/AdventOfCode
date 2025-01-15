import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2021,
    day: 14,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  ui: { show: false, during: true },
  params: {
    iterations: {
      part1: 10,
      part2: 40
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 1588,
      part2: 2188189693529
    }
  },
  prod: {
    answers: {
      part1: 3247,
      part2: 4110568157153
    }
  }
}
export default config
