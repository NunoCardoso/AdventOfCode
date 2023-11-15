import aoc from 'aoc'

aoc({
  year: '2016',
  day: '10',
  logLevel: 'info',
  params: {
    test: {
      botValues: [2, 5]
    },
    prod: {
      botValues: [17, 61]
    }
  },
  test: {
    id: 'test',
    part1: {
      answer: 2
    },
    part2: {
      answer: 5 * 3 * 2
    }
  },
  prod: {
    part1: {
      answer: 147
    },
    part2: {
      answer: 55637
    }
  }
})
