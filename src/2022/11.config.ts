import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 11,
    title: 'Monkey in the Middle',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'First puzzle using the multiple common denominator to extrapolate results'
  },
  params: {
    iterations: {
      part1: 20,
      part2: 10000
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 10605,
      part2: 2713310158
    }
  },
  prod: {
    answers: {
      part1: 62491,
      part2: 17408399184
    }
  }
}

export default config
