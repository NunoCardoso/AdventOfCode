import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 2,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  params: {
    cubes: [12, 13, 14]
  },
  test: {
    id: 'test',
    answers: {
      part1: 8,
      part2: 2286
    }
  },
  prod: {
    answers: {
      part1: 2913,
      part2: 55593
    }
  }
}

export default config
