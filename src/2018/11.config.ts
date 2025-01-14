import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Chronal Charge',
    year: 2018,
    day: 11,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    difficulty: 5
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: '33,45',
        part2: '90,269,16'
      }
    },
    {
      id: 'test2',
      answers: {
        part1: '21,61',
        part2: '232,251,12'
      }
    }
  ],
  params: {
    size: 300
  },
  prod: {
    answers: {
      part1: '34,72',
      part2: '233,187,13'
    }
  }
}

export default config
