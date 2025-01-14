import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'A Series of Tubes',
    year: 2017,
    day: 19,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 'ABCDEF',
      part2: 38
    }
  },
  prod: {
    answers: {
      part1: 'FEZDNIVJWT',
      part2: 17200
    }
  }
}

export default config
