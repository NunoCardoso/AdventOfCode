import aoc from '../aoc'

aoc({
  year: '2022',
  day: '15',
  logLevel: 'error',
  test: {
    skip: false,
    id: 'test',
    params: {
      y: 10,
      limit: 20
    },
    part1: {
      answer: 26
    },
    part2: {
      answer: 56000011
    }
  },
  prod: {
    skip: false,
    params: {
      y: 2000000,
      limit: 4000000
    },
    part1: {
      answer: 5403290
    },
    part2: {
      answer: 10291582906626
    }
  }
})
