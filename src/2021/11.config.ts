import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Dumbo Octopus',
    year: 2021,
    day: 11,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  ui: { show: false, during: true },
  test: {
    id: 'test',
    answers: {
      part1: 1656,
      part2: 195
    }
  },
  prod: {
    answers: {
      part1: 1719,
      part2: 232
    }
  }
}

export default config
