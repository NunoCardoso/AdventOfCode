import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Trick Shot',
    year: 2021,
    day: 17,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 45,
      part2: 112
    }
  },
  prod: {
    answers: {
      part1: 12246,
      part2: 3528
    }
  }
}

export default config
