import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Chiton',
    year: 2021,
    day: 15,
    result: 'unfinished',
    status: 'solved',
    speed: 'medium',
    code: 'dirty',
    difficulty: 3,
    tags: ['A*', 'Path-finding']
  },
  mode: 'fastest',
  logLevel: 'info',
  ui: {
    show: false,
    during: true,
    wait: 10
  },
  test: {
    id: 'test',
    answers: {
      part1: 40,
      part2: 315
    }
  },
  prod: {
    answers: {
      part1: 458,
      part2: 2800
    }
  }
}

export default config
