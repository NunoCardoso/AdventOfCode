import aoc from 'aoc'

aoc({
  year: '2022',
  day: '09',
  params: {
    part1: {
      ropeLength: 2
    },
    part2: {
      ropeLength: 10
    }
  },
  test: [
    {
      id: 'test1',
      part1: {
        answer: 13
      }
    },
    {
      id: 'test2',
      part2: {
        answer: 36
      }
    }
  ],
  prod: {
    part1: {
      answer: 6367
    },
    part2: {
      answer: 2536
    }
  }
})
