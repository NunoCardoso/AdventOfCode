import aoc from '../aoc'

aoc({
  year: '2022',
  day: '16',
  logLevel: 'info',
  params: {
    part1: {
      limit: 30
    },
    part2: {
      limit: 26
    }
  },
  test: {
    id: 'test',
    part1: {
      answer: 1651
    },
    part2: {
      answer: 1707
    }
  },
  prod: {
    skip: false,
    part1: {
      answer: 2124
    },
    part2: {
      answer: 2775
    }
  }
})
