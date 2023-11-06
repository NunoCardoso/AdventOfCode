import aoc from '../aoc'

aoc({
  year: '2016',
  day: '01',
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      part1: {
        answer: 5
      }
    },
    {
      id: 'test2',
      part1: {
        answer: 2
      }
    },
    {
      id: 'test3',
      part1: {
        answer: 12
      }
    },
    {
      id: 'test4',
      part2: {
        answer: 4
      }
    }
  ],
  prod: {
    part1: {
      answer: 279
    },
    part2: {
      answer: 163
    }
  }
})
