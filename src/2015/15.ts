import aoc from 'aoc'

aoc({
  year: '2015',
  day: '15',
  logLevel: 'info',
  params: {
    calories: {
      part1: undefined,
      part2: 500
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 62842880,
      part2: 57600000
    }
  },
  prod: {
    answers: {
      part1: 18965440,
      part2: 15862900
    }
  }
})
