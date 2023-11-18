import aoc from 'aoc'

aoc({
  year: '2022',
  day: '11',
  logLevel: 'info',
  params: {
    iterations: {
      part1: 20,
      part2: 10000
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 10605,
      part2: 2713310158
    }
  },
  prod: {
    answers: {
      part1: 62491,
      part2: 17408399184
    }
  }
})