import aoc from '../aoc'

aoc({
  year: '2015',
  day: '15',
  logLevel: 'info',
  params: {
    part1: {
      calories: undefined
    },
    part2: {
      calories: 500
    }
  },
  test: {
    id: 'test',
    part1: {
      answer: 62842880
    },
    part2: {
      answer: 57600000
    }
  },
  prod: {
    part1: {
      answer: 18965440
    },
    part2: {
      answer: 15862900
    }
  }
})
