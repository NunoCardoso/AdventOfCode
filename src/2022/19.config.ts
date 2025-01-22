import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Not Enough Minerals',
    year: 2022,
    day: 19,
    result: 'unfinished',
    status: 'solved',
    speed: 'fast',
    code: 'dirty',
    tags: ['Path-finding'],
    difficulty: 5
  },
  mode: 'fastest',
  params: {
    limit: {
      part1: 24,
      part2: 32
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 33,
      part2: 3472
    }
  },
  prod: {
    answers: {
      part1: 1624,
      part2: 12628
    }
  }
}

export default config
