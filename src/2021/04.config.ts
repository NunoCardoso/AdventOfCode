import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2021,
    day: 4,
    title: 'Giant Squid',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'verbose but very quick because I used indexes to make sure I check only bingo cards with valid numbers',
    difficulty: 2
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 4512,
      part2: 1924
    }
  },
  prod: {
    answers: {
      part1: 38594,
      part2: 21184
    }
  }
}

export default config
