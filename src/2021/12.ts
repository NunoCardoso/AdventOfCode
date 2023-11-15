import aoc from 'aoc'

aoc({
  year: '2021',
  day: '12',
  logLevel: 'info',
  ui: { show: false, during: true },
  test: [
    {
      id: 'test1',
      skip: false,
      part1: {
        answer: 10
      },
      part2: {
        answer: 36
      }
    },
    {
      id: 'test2',
      skip: false,
      part1: {
        answer: 19
      },
      part2: {
        answer: 103
      }
    },
    {
      id: 'test3',
      skip: false,
      part1: {
        answer: 226
      },
      part2: {
        answer: 3509
      }
    }
  ],
  prod: {
    part1: {
      answer: 3713
    },
    part2: {
      answer: 91292
    }
  }
})
