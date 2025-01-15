import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 25,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  ui: {
    show: false
  },
  test: [
    {
      id: 'test1',
      params: {
        mode: 'dec2SNAFU'
      }
    },
    {
      id: 'test2',
      params: {
        mode: 'SNAFU2dec'
      }
    }
  ],
  prod: {
    answers: {
      part1: '2-00=12=21-0=01--000'
    }
  }
}

export default config
