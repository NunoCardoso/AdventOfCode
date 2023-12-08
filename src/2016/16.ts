import aoc from 'aoc'

aoc({
  year: '2016',
  day: '16',
  logLevel: 'debug',

  test: {
    id: 'test',
    params: {
      input: '10000',
      size: {
        part1: 20
      }
    },
    answers: {
      part1: '01100'
    }
  },
  prod: {
    params: {
      input: '10111011111001111',
      size: {
        part1: 272,
        part2: 35651584
      }
    },
    answers: {
      part1: '11101010111100010',
      part2: '01001101001000101'
    }
  }
})
