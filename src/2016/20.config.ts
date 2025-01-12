import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Firewall Rules',
    year: 2016,
    day: 20,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: {
    params: {
      limit: 9
    },
    id: 'test',
    answers: {
      part1: 3,
      part2: 2
    }
  },
  prod: {
    params: {
      limit: 4294967295
    },
    answers: {
      part1: 31053880,
      part2: 117
    }
  }
}

export default config
