import aoc from 'aoc'

aoc({
  year: '2016',
  day: '19',
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      elves: 5
    },
    answers: {
      part1: 3,
      part2: 2
    }
  },
  prod: {
    params: {
      elves: 3018458
    },
    answers: {
      part1: 1842613,
      part2: 1424135
    }
  }
})
