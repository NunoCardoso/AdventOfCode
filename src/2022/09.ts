import aoc from 'aoc'

aoc({
  year: '2022',
  day: '09',
  params: {
    ropeLength: {
      part1: 2,
      part2: 10
    }
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 13
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 36
      }
    }
  ],
  prod: {
    answers: {
      part1: 6367,
      part2: 2536
    }
  }
})
