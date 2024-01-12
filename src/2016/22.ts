export default {
  config: {
    year: '2016',
    day: '22',
    title: 'Grid Computing'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: 'part1',
    answers: {
      part1: 0,
      part2: 7
    }
  },
  prod: {
    skip: 'part2',
    answers: {
      part1: 892,
      part2: 0
    }
  }
}
