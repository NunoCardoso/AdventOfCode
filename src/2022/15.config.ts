export default {
  config: {
    year: '2022',
    day: '15',
    comment:
      'This is a great puzzle, as it is way easier to rotate 45 degrees and use square areas instead of diamond' +
      'areas. also, finding the sole beacon for part 2 requires some brainstorming explained on readme'
  },
  test: {
    id: 'test',
    params: {
      y: 10,
      limit: 20
    },
    answers: {
      part1: 26,
      part2: 56000011
    }
  },
  prod: {
    params: {
      y: 2000000,
      limit: 4000000
    },
    answers: {
      part1: 5403290,
      part2: 10291582906626
    }
  }
}
