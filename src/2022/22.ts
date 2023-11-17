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
    id: 'test',
    answers: {
      part1: 6032,
      part2: 5031
    }
  },
  prod: {
    params: {
      cubeSize: 50
    },
    answers: {
      part1: 149138,
      part2: 153203
    }
  }
})
