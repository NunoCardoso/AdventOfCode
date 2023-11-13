import aoc from '../aoc'

aoc({
  year: '2016',
  day: '09',
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      part1: {
        answer: 18
      },
      part2: {
        skip: true
      }
    },
    {
      id: 'test2',
      part1: {
        skip: true
      },
      part2: {
        answer: 445
      }
    },
    {
      id: 'test3',
      part1: {
        skip: true
      },
      part2: {
        answer: 241920
      }
    }
  ],
  prod: {
    part1: {
      answer: 70186
    },
    part2: {
      answer: 10915059201
    }
  }
})
