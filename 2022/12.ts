import aoc from '../aoc'

aoc({
  year: '2022',
  day: '12',
  mode: 'fastest',
  ui: {
    show: true,
    during: false,
    wait: 10,
    end: true
  },
  logLevel: 'info',
  test: {
    skip: true,
    id: 'test',
    part1: {
      answer: 31
    },
    part2: {
      answer: 29
    }
  },
  prod: {
    skip: false,
    part1: {
      answer: 412
    },
    part2: {
      answer: 402
    }
  }
})
