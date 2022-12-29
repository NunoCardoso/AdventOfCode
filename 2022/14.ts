import aoc from '../aoc'

aoc({
  year: '2022',
  day: '14',
  ui: {
    show: true,
    during: false,
    wait: 10,
    end: false
  },
  test: {
    id: 'test',
    part1: {
      answer: 24
    },
    part2: {
      answer: 93
    }
  },
  prod: {
    part1: {
      answer: 1133
    },
    part2: {
      answer: 27566
    }
  }
})
