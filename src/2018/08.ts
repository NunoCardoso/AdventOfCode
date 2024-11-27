export default {
  config: {
    year: '2018',
    day: '08',
    title: 'Memory Maneuver',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: 'part1',
    answers: {
      part1: 138,
      part2: 66
    }
  },
  prod: {
    skip: 'part1',
    answers: {
      part1: 42951,
      part2: 18568
    }
  }
}
