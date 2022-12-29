import aoc from '../aoc'

aoc({
  year: '2016',
  day: '04',
  logLevel: 'info',
  params: {
    needle: 'very encrypted name'
  },
  test: [{
    id: 'test',
    part1: {
      answer: 1514
    }
  }, {
    id: 'test2',
    part2: {
      answer: 343
    }
  }],
  prod: {
    params: {
      needle: 'northpole object storage'
    },
    skip: false,
    part1: {
      answer: 361724
    },
    part2: {
      answer: 482
    }
  }
})
