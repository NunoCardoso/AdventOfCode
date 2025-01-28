import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Not Enough Minerals',
    year: 2022,
    day: 19,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    tags: ['Path-finding'],
    difficulty: 5
  },
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
