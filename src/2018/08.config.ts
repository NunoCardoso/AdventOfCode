import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Memory Maneuver',
    year: 2018,
    day: 8,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 138,
      part2: 66
    }
  },
  prod: {
    answers: {
      part1: 42951,
      part2: 18568
    }
  }
}

export default config
