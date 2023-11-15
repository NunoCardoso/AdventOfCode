import aoc from 'aoc'

aoc({
  year: '2015',
  day: '19',
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true
  },
  test: [
    {
      id: 'test1',
      part1: {
        answer: 4
      },
      part2: {
        answer: 3
      }
    },
    {
      id: 'test2',
      part1: {
        answer: 7
      },
      part2: {
        answer: 6
      }
    }
  ],
  prod: {
    skip: true,
    /* params: {
      part1: {
        skip: true
      }
    }, */
    part1: {
      answer: 576
    },
    part2: {
      answer: 0
    }
  }
})
