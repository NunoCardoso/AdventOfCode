import aoc from 'aoc'

aoc({
  year: '2016',
  day: '19',
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      elves: 5
    },
    answers: {
      part1: 3,
      part2: 0
    }
  },
  prod: {
    skip: true,
    params: {
      elves: 3018458
    },
    answers: {
      part1: 0,
      part2: 0
    }
  }
})
