import aoc from 'aoc'

aoc({
  year: '2015',
  day: '17',
  logLevel: 'info',
  test: {
    skip: false,
    id: 'test',
    params: {
      limit: 25
    },
    part1: {
      answer: 4
    },
    part2: {
      answer: 3
    }
  },
  prod: {
    skip: false,
    params: {
      limit: 150
    },
    part1: {
      answer: 4372
    },
    part2: {
      answer: 4
    }
  }
})
