import aoc from 'aoc'

aoc({
  year: '2016',
  day: '10',
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      botValues: [2, 5]
    },
    answers: {
      part1: 2,
      part2: 5 * 3 * 2
    }
  },
  prod: {
    params: {
      botValues: [17, 61]
    },
    answers: {
      part1: 147,
      part2: 55637
    }
  }
})
