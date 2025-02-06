import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Toboggan Trajectory',
    year: 2020,
    day: 3,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 7,
      part2: 336
    }
  },
  prod: {
    answers: {
      part1: 200,
      part2: 3737923200
    }
  }
}

export default config
