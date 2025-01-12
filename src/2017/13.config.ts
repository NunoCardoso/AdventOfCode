import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Packet Scanners',
    year: 2017,
    day: 13,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Can has some optimization but nice. had to make test unit.',
    difficulty: 2
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 24,
      part2: 10
    }
  },
  prod: {
    answers: {
      part1: 648,
      part2: 3933124
    }
  }
}

export default config
