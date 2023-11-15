import aoc from 'aoc'

aoc({
  year: '2022',
  day: '23',
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true
  },
  params: {
    part1: {
      iterations: 10
    },
    part2: {
      iterations: 10000000
    }
  },
  test: [
    {
      id: 'test1',
      part1: {
        answer: 25
      }
    },
    {
      id: 'test2',
      part1: {
        answer: 110
      },
      part2: {
        answer: 20
      }
    }
  ],
  prod: {
    part1: {
      answer: 4249
    },
    part2: {
      answer: 980
    }
  }
})
