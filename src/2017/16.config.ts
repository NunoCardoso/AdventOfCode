import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Permutation Promenade',
    year: 2017,
    day: 16,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'typical have-to-find-a-delta so I can skip 10000000 iterations. Nice',
    difficulty: 3
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      programs: 'abcde'.split('')
    },
    answers: {
      part1: 'baedc'
    }
  },
  prod: {
    params: {
      programs: 'abcdefghijklmnop'.split('')
    },
    answers: {
      part1: 'gkmndaholjbfcepi',
      part2: 'abihnfkojcmegldp'
    }
  }
}

export default config
