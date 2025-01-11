import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Timing is Everything',
    year: 2016,
    day: 15,
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
      part1: 5
    }
  },
  prod: {
    answers: {
      part1: 122318,
      part2: 3208583
    }
  }
}

export default config
