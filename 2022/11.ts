import aoc from '../aoc'

aoc({
  year: '2022',
  day: '11',
  logLevel: 'info',
  params: {
    part1: {
      iterations: 20
    },
    part2: {
      iterations: 10000
    }
  },
  test: {
    id: 'test',
    part1: {
      answer: 10605
    },
    part2: {
      answer: 2713310158
    }
  },
  prod: {
    part1: {
      answer: 62491
    },
    part2: {
      answer: 17408399184
    }
  }
})
