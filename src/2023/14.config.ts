import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Parabolic Reflector Dish',
    year: 2023,
    day: 14,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'info',
  params: {
    cycles: 1000000000
  },
  test: {
    id: 'test',
    answers: {
      part1: 136,
      part2: 64
    }
  },
  prod: {
    answers: {
      part1: 110565,
      part2: 89845
    }
  }
}

export default config
