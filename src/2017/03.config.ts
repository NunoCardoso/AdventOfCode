import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Spiral Memory',
    year: 2017,
    day: 3,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Trying to be smart and avoid doing a spiral for part1, so that part2 "forces" me to do a spiral...',
    difficulty: 1
  },
  test: {
    id: 'test',
    params: {
      value: 1024
    },
    answers: {
      part1: 31,
      part2: 1968
    }
  },
  prod: {
    params: {
      value: 368078
    },
    answers: {
      part1: 371,
      part2: 369601
    }
  }
}

export default config
