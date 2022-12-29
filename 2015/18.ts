import aoc from '../aoc'

aoc({
  year: '2015',
  day: '18',
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true
  },
  test: [{
    id: 'test',
    params: {
      limit: 4
    },
    part1: {
      answer: 4
    }
  }, {
    id: 'test2',
    params: {
      limit: 5
    },
    part2: {
      answer: 17
    }
  }],
  prod: {
    params: {
      limit: 100
    },
    skip: false,
    part1: {
      answer: 768
    },
    part2: {
      answer: 781
    }
  }
})
