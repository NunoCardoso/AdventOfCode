import aoc from 'aoc'

aoc({
  year: '2023',
  day: '12',
  logLevel: 'info',
  test: {
    id: 'test',
    skip: 'part2',
    answers: {
      part1: 21,
      part2: 525152
    }
  },
  prod: {
    answers: {
      part1: 7922,
      part2: 18093821750095
    }
  }
})