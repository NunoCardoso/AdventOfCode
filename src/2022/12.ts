import aoc from 'aoc'

aoc({
  year: '2022',
  day: '12',
  mode: 'fastest',
  ui: {
    show: true,
    during: false,
    wait: 10,
    end: true
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 31,
      part2: 29
    }
  },
  prod: {
    answers: {
      part1: 412,
      part2: 402
    }
  }
})
