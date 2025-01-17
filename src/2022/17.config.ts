import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 17,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  ui: {
    show: false
  },
  params: {
    wellWidth: 7,
    rocks: {
      part1: 2022,
      part2: 1000000000000
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 3068,
      part2: 1514285714288
    }
  },
  prod: {
    answers: {
      part1: 3177,
      part2: 1565517241382
    }
  }
}

export default config
