import aoc from 'aoc'

aoc({
  year: '2015',
  day: '17',
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      limit: 25
    },
    answers: {
      part1: 4,
      part2: 3
    }
  },
  prod: {
    params: {
      limit: 150
    },
    answers: {
      part1: 4372,
      part2: 4
    }
  }
})
