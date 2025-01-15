import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 3,
    title: 'Mull It Over',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Nice that I still remember OR regexes, really helps a lot here',
    difficulty: 1
  },
  logLevel: 'info',
  test: [
    {
      id: 'test',
      answers: {
        part1: 161
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 48
      }
    }
  ],
  prod: {
    answers: {
      part1: 178538786,
      part2: 102467299
    }
  }
}

export default config
