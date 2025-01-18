import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Monkey in the Middle',
    year: 2022,
    day: 11,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
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
