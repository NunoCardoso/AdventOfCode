import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2021,
    day: 10,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  ui: { show: true, end: true },
  test: {
    id: 'test',
    answers: {
      part1: 26397,
      part2: 288957
    }
  },
  prod: {
    answers: {
      part1: 321237,
      part2: 2360030859
    }
  }
}

export default config
