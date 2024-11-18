export default {
  config: {
    year: '2018',
    day: '01',
    title: 'Chronal Calibration',
    status: 'done',
    comment: 'choke on part2 because didnt reat it. slow, could be optimized',
    difficulty: 1
  },
  logLevel: 'debug',
  test: [{
    id: 'test1',
    answers: {
      part2: 0
    }
  },{
    id: 'test2',
    answers: {
      part2: 10
    }
  }, {
    id: 'test3',
    answers: {
      part2: 5
    }
  },  {
    id: 'test4',
    answers: {
      part2: 14
    }
  }],
  prod: {
    skip: false,
    answers: {
      part1: 445,
      part2: 219
    }
  }
}
