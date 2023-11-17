import aoc from 'aoc'

aoc({
  year: '2022',
  day: '18',
  logLevel: 'info',
  ui: {
    show: false,
    wait: 100
  },
  test: {
    id: 'test',
    answers: {
      part1: 64,
      part2: 58
    }
  },
  prod: {
    answers: {
      part1: 4450,
      part2: 2564
    }
  }
})
