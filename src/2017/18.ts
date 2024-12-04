export default {
  config: {
    year: '2017',
    day: '18',
    title: 'Duet',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        // part1: 4
      }
    },
    {
      id: 'test2',
      answers: {
        //  part2: 3
      }
    }
  ],
  prod: {
    answers: {
      //    part1: 8600,
      part2: 0
      // 127 too low
      // 4003476 too high
    }
  }
}
