import aoc from 'aoc'

aoc({
  year: '2015',
  day: '24',
  params: {
    compartments: {
      part1: 3,
      part2: 4
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 99,
      part2: 44
    }
  },
  prod: {
    answers: {
      part1: 10439961859,
      part2: 72050269
    }
  }
})
