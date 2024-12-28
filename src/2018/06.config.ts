export default {
  config: {
    year: '2018',
    day: '06',
    title: 'Chronal Coordinates',
    status: 'done',
    comment:
      'Did not like my approach, it assumes a 0-1000 grid, calculates all spots, was expecting something better',
    difficulty: 4
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      threshold: 32
    },
    answers: {
      part1: 17,
      part2: 16
    }
  },
  prod: {
    params: {
      threshold: 10000
    },
    answers: {
      part1: 5532,
      part2: 36216
    }
  }
}
