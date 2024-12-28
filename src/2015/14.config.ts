import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Reindeer Olympics',
    year: 2015,
    day: 14,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  test: {
    id: 'test',
    params: {
      seconds: 1000
    },
    answers: {
      part1: 1120,
      part2: 689
    }
  },
  prod: {
    params: {
      seconds: 2503
    },
    answers: {
      part1: 2696,
      part2: 1084
    }
  }
}

export default config
