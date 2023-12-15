import aoc from 'aoc'

aoc({
  year: '2023',
  day: '16',
  logLevel: 'info',
  test: {
    id: 'test',
    skip: true,
    answers: {
      part1: 46,
      part2: 51
    }
  },
  prod: {
    skip: 'part1',
    answers: {
      part1: 7060,
      part2: 7493
    }
  }
})
