import aoc from 'aoc'

aoc({
  year: '2022',
  day: '24',
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true,
    wait: 10
  },
  test: {
    skip: false,
    id: 'test',
    answers: {
      part1: 18,
      part2: 54
    }
  },
  prod: {
    answers: {
      part1: 305,
      part2: 905
    }
  }
})
