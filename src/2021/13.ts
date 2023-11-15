import aoc from 'aoc'

aoc({
  year: '2021',
  day: '13',
  logLevel: 'info',
  ui: { show: false, during: true },
  test: {
    id: 'test',
    skip: false,
    part1: {
      answer: 17
    },
    part2: {
      skip: true
    }
  },
  prod: {
    part1: {
      answer: 802
    },
    part2: {
      answer: 'RKHFZGUB'
    }
  }
})
