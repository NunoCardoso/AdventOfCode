import aoc from '../aoc'

aoc({
  year: '2015',
  day: '14',
  test: {
    id: 'test',
    params: {
      cutoff: 1000
    },
    part1: {
      answer: 1120
    },
    part2: {
      answer: 689
    }
  },
  prod: {
    params: {
      cutoff: 2503
    },
    part1: {
      answer: 2696
    },
    part2: {
      answer: 1084
    }
  }
})
