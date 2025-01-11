import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'One-Time Pad',
    year: 2016,
    day: 14,
    result: 'finished',
    status: 'solved',
    speed: 'md5',
    code: 'clean',
    tags: ['MD5'],
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      salt: 'abc',
      cutoff: 64,
      viewAhead: 1000,
      repetition: 2016
    },
    answers: {
      part1: 22728,
      part2: 22551
    }
  },
  prod: {
    params: {
      salt: 'yjdafjpo',
      cutoff: 64,
      viewAhead: 1000,
      repetition: 2016
    },
    answers: {
      part1: 25427,
      part2: 22045
    }
  }
}

export default config
