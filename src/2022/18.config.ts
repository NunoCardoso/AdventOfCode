import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 18,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  ui: {
    show: false,
    wait: 100
  },
  test: {
    id: 'test',
    answers: {
      part1: 64,
      part2: 58
    }
  },
  prod: {
    answers: {
      part1: 4450,
      part2: 2564
    }
  }
}

export default config
