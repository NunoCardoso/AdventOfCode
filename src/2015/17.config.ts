import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'No Such Thing as Too Much',
    year: 2015,
    day: 17,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    tags: ['Permutation'],
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      limit: 25
    },
    answers: {
      part1: 4,
      part2: 3
    }
  },
  prod: {
    params: {
      limit: 150
    },
    answers: {
      part1: 4372,
      part2: 4
    }
  }
}

export default config
