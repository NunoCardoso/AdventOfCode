import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Mine Cart Madness',
    year: 2018,
    day: 13,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'info',
  ui: {
    show: false,
    during: true,
    keypress: true
  },
  test: [
    {
      id: 'test1',
      skip: 'part2',
      answers: {
        part1: '7,3'
      }
    },
    {
      id: 'test2',
      skip: 'part1',
      answers: {
        part2: '6,4'
      }
    }
  ],
  prod: {
    answers: {
      part1: '111,13',
      part2: '16,73'
    }
  }
}

export default config
