export default {
  config: {
    year: '2024',
    day: '18',
    title: '',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    params: {
      size: [7, 7],
      start: [0, 0],
      end: [6, 6]
    },
    id: 'test',
    answers: {
      part1: 22
      //part2: 0
    }
  },
  prod: {
    params: {
      size: [71, 71],
      start: [0, 0],
      end: [70, 70]
    },
    answers: {
      //part1: 0,
      //part2: 0
    }
  }
}
