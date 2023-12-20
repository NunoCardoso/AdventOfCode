export default {
  config: {
    year: '2022',
    day: '24',
    comment: 'too long, but it finishes with right solution'
  },
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true,
    wait: 10
  },
  test: {
    id: 'test',
    answers: {
      part1: 18,
      part2: 54
    }
  },
  prod: {
    answers: {
      part1: 305,
      part2: 905
    }
  }
}
