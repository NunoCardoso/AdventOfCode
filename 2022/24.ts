import aoc from '../aoc'

aoc({
  year: '2022',
  day: '24',
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true,
    wait: 10
  },
  test: {
    skip: false,
    id: 'test',
    part1: {
      answer: 18
    },
    part2: {
      answer: 54
    }
  },
  prod: {
    skip: false,
    part1: {
      answer: 305
    },
    part2: {
      answer: 905
    }
  }
})
