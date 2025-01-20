import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Regolith Reservoir',
    year: 2022,
    day: 14,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    tags: ['Recursion'],
    difficulty: 3
  },
  ui: {
    show: true,
    during: false,
    wait: 10,
    end: false
  },
  params: {
    start: [500, 0]
  },
  test: {
    id: 'test',
    answers: {
      part1: 24,
      part2: 93
    }
  },
  prod: {
    answers: {
      part1: 1133,
      part2: 27566
    }
  }
}

export default config
