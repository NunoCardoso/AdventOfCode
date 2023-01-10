import aoc from '../aoc'

aoc({
  year: '2022',
  day: '19',
  logLevel: 'warn',
  mode: 'fastest',
  params: {
    part1: {
      limit: 24
    },
    part2: {
      limit: 32
    }
  },
  test: {
    id: 'test',
    skip: false,
    part1: {
      answer: 33
    },
    part2: {
      answer: 3472
    }
  },
  prod: {
    skip: false,
    part1: {
      answer: 1624
    },
    part2: {
      answer: 12628
    }
  }
})
