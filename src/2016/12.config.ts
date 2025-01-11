import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: "Leonardo's Monorail",
    year: 2016,
    day: 12,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  test: {
    id: 'test',
    answers: {
      part1: 42
    }
  },
  prod: {
    answers: {
      part1: 318117,
      part2: 9227771
    }
  }
}

export default config
