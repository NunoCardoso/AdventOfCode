import aoc from 'aoc'

aoc({
  year: '2022',
  day: '17',
  logLevel: 'error',
  ui: {
    show: false
  },
  params: {
    wellWidth: 7,
    part1: {
      rocks: 2022
    },
    part2: {
      rocks: 1000000000000
    }
  },
  test: {
    id: 'test',
    part1: {
      answer: 3068
    },
    part2: {
      answer: 1514285714288
    }
  },
  prod: {
    part1: {
      answer: 3177
    },
    part2: {
      answer: 1565517241382
    }
  }
})
