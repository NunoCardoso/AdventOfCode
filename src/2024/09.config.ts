import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 9,
    title: 'Disk Fragmenter',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Avoided lists, ended up to use a list anyway.',
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 1928,
      part2: 2858
    }
  },
  prod: {
    answers: {
      part1: 6330095022244,
      part2: 6359491814941
    }
  }
}

export default config
