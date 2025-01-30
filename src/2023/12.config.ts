import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Hot Springs',
    year: 2023,
    day: 12,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4,
    tags: ['Path-finding', 'Depth-first']
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 21,
      part2: 525152
    }
  },
  prod: {
    answers: {
      part1: 7922,
      part2: 18093821750095
    }
  }
}

export default config
