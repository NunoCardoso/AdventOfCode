import aoc from 'aoc'

aoc({
  year: '2023',
  day: '14',
  logLevel: 'info',
  params: {
    cycles: 1000000000
  },
  test: {
    id: 'test',
    answers: {
      part1: 136,
      part2: 64
    }
  },
  prod: {
    answers: {
      part1: 110565,
      part2: 89845
    }
  }
})
