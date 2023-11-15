import aoc from 'aoc'

aoc({
  year: '2022',
  day: '18',
  logLevel: 'info',
  ui: {
    show: false,
    wait: 100
  },
  test: {
    id: 'test',
    part1: {
      answer: 64
    },
    part2: {
      answer: 58
    }
  },
  prod: {
    part1: {
      answer: 4450
    },
    part2: {
      answer: 2564
    }
  }
})
