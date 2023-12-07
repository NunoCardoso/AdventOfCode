import aoc from 'aoc'

aoc({
  year: '2016',
  day: '13',
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      designerNumber: 10,
      target: [7, 4]
    },
    answers: {
      part1: 11
    }
  },
  prod: {
    params: {
      designerNumber: 1350,
      target: [31, 39]
    },
    answers: {
      part1: 92,
      part2: 124
    }
  }
})
