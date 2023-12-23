export default {
  config: {
    year: '2022',
    day: '14',
    title: 'Regolith Reservoir',
    status: 'done',
    comment:
      'The hardest part is to get used to x, y coords instead of row, col. Not the fastest solution, as I ' +
      'do drop sand point by point, but it is fast enough'
  },
  ui: {
    show: true,
    during: false,
    wait: 10,
    end: false
  },
  params: {
    start: [500, 0]
  },
  test: {
    id: 'test',
    answers: {
      part1: 24,
      part2: 93
    }
  },
  prod: {
    answers: {
      part1: 1133,
      part2: 27566
    }
  }
}
