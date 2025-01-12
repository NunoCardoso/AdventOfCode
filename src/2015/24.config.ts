import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'It Hangs in the Balance',
    year: 2015,
    day: 24,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    tags: ['Combination'],
    difficulty: 5
  },
  logLevel: 'info',
  params: {
    compartments: {
      part1: 3,
      part2: 4
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 99,
      part2: 44
    }
  },
  prod: {
    answers: {
      part1: 10439961859,
      part2: 72050269
    }
  }
}

export default config
