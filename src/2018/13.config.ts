export default {
  config: {
    year: '2018',
    day: '13',
    title: 'Mine Cart Madness',
    status: 'done',
    comment: 'Damn missed the part where they move first by row. read the damn text',
    difficulty: 4
  },
  logLevel: 'info',
  ui: {
    show: false,
    during: true,
    keypress: true
  },
  test: [
    {
      id: 'test1',
      skip: 'part2',
      answers: {
        part1: '7,3'
      }
    },
    {
      id: 'test2',
      skip: 'part1',
      answers: {
        part2: '6,4'
      }
    }
  ],
  prod: {
    answers: {
      part1: '111,13',
      part2: '16,73'
    }
  }
}
