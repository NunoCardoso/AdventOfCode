import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Spiral Memory',
    year: 2017,
    day: 3,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
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
