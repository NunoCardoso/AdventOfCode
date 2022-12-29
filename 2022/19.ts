import aoc from '../aoc'

aoc({
  year: '2022',
  day: '19',
  logLevel: 'info',
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
    params: {
      part2: {
        skip: true
      }
    },
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
