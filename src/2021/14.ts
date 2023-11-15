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
    skip: false,
    part1: {
      answer: 1588
    },
    part2: {
      answer: 2188189693529
    }
  },
  prod: {
    part1: {
      answer: 3247
    },
    part2: {
      answer: 4110568157153
    }
  }
})
