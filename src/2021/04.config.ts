import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Giant Squid',
    year: 2021,
    day: 4,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 4512,
      part2: 1924
    }
  },
  prod: {
    answers: {
      part1: 38594,
      part2: 21184
    }
  }
}

export default config
