import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Camel Cards',
    year: 2023,
    day: 7,
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
      part1: 6440,
      part2: 5905
    }
  },
  prod: {
    answers: {
      part1: 249204891,
      part2: 249666369
    }
  }
}

export default config
