import aoc from 'aoc'

aoc({
  year: '2022',
  day: '22',
  logLevel: 'info',
  ui: {
    show: false
  },
  test: {
    params: {
      cubeSize: 4
    },
    skip: false,
    id: 'test',
    part1: {
      answer: 6032
    },
    part2: {
      answer: 5031
    }
  },
  prod: {
    params: {
      cubeSize: 50
    },
    skip: false,
    part1: {
      answer: 149138
    },
    part2: {
      answer: 153203
    }
  }
})
