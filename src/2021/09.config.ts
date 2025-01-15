import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2021,
    day: 9,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  ui: { show: true, end: true },
  test: {
    id: 'test',
    answers: {
      part1: 15,
      part2: 1134
    }
  },
  prod: {
    answers: {
      part1: 564,
      part2: 1038240
    }
  }
}

export default config
