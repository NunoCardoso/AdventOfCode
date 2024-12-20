export default {
  config: {
    year: '2024',
    day: '18',
    title: '',
    status: 'inprogress',
    comment: 'In this puzzle, X is horizontal (col) distance, Y is vertical (row) distance',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    params: {
      time: 12,
      size: { height: 7, width: 7 },
      start: { x: 0, y: 0 },
      end: { x: 6, y: 6 }
    },
    id: 'test',
    answers: {
      part1: 22
      //part2: 0
    }
  },
  prod: {
    params: {
      time: 1024,
      size: { height: 71, width: 71 },
      start: { x: 0, y: 0 },
      end: { x: 70, y: 70 }
    },
    answers: {
      //part1: 0,
      //part2: 0
    }
  }
}
