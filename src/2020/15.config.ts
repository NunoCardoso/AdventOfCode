import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Rambunctious Recitation',
    year: 2020,
    day: 15,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'debug',
  params: {
    iterations: {
      part1: 2020,
      part2: 30000000
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 436,
      part2: 175594
    }
  },
  prod: {
    answers: {
      part1: 1085,
      part2: 10652
    }
  }
}

export default config
