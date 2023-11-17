import aoc from 'aoc'

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
    answers: {
      part1: 26,
      part2: 56000011
    }
  },
  prod: {
    params: {
      y: 2000000,
      limit: 4000000
    },
    answers: {
      part1: 5403290,
      part2: 10291582906626
    }
  }
})
