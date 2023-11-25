import aoc from 'aoc'

aoc({
  year: '2015',
  day: '20',
  test: {
    id: 'test',
    params: {
      threshold: 150
    },
    answers: {
      part1: 8
    }
  },
  prod: {
    params: {
      threshold: 33100000
    },
    answers: {
      part1: 776160,
      part2: 786240
    }
  }
})
