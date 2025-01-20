import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Beacon Exclusion Zone',
    year: 2022,
    day: 15,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  test: {
    id: 'test',
    params: {
      y: 10,
      limit: 20
    },
    answers: {
      part1: 26,
      part2: 56000011
    }
  },
  prod: {
    params: {
      y: 2000000,
      limit: 4000000
    },
    answers: {
      part1: 5403290,
      part2: 10291582906626
    }
  }
}

export default config
