import aoc from 'aoc'

aoc({
  year: '2021',
  day: '15',
  logLevel: 'info',
  ui: {
    show: false,
    during: true,
    wait: 10
  },
  test: {
    id: 'test',
    answers: {
      part1: 40,
      part2: 315
    }
  },
  prod: {
    answers: {
      part1: 458,
      part2: 2800
    }
  }
})
