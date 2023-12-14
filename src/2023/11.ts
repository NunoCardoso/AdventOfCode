import aoc from 'aoc'

aoc({
  year: '2023',
  day: '11',
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      distance: 100
    },
    answers: {
      part1: 374,
      part2: 8410
    }
  },
  prod: {
    params: {
      distance: 1000000
    },
    answers: {
      part1: 9742154,
      part2: 411142919886
    }
  }
})
