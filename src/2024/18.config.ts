export default {
  config: {
    year: '2024',
    day: '18',
    title: 'RAM Run',
    status: 'done',
    comment: 'In this puzzle, X is horizontal (col) distance, Y is vertical (row) distance. I am out of ideas to' + 'optimize, maybe try bytes / 2, then bytes / 4, etc',
    tags: ['a*'],
    difficulty: 4
  },
  logLevel: 'info',
  ui: {
    show: false,
    keypress: false
  },
  test: {
    params: {
      time: 12,
      size: { height: 7, width: 7 },
      start: { x: 0, y: 0 },
      end: { x: 6, y: 6 }
    },
    id: 'test',
    answers: {
      part1: 22,
      part2: '6,1'
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
      part1: 288,
      part2: ' 52,5'
    }
  }
}
