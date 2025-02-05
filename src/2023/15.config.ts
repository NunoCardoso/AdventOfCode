import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Lens Library',
    year: 2023,
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
      part1: 1320,
      part2: 145
    }
  },
  prod: {
    answers: {
      part1: 513214,
      part2: 258826
    }
  }
}

export default config
