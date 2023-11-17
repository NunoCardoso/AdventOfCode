import aoc from 'aoc'

aoc({
  year: '2021',
  day: '14',
  logLevel: 'info',
  ui: { show: false, during: true },
  params: {
    iterations: {
      part1: 10,
      part2: 40
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 1588,
      part2: 2188189693529
    }
  },
  prod: {
    answers: {
      part1: 3247,
      part2: 4110568157153
    }
  }
})
