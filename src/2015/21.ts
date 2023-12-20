export default {
  config: {
    year: '2015',
    day: '21'
  },
  test: {
    id: 'test',
    params: {
      hitPoints: 8
    },
    answers: {
      part1: 65,
      part2: 148
    }
  },
  prod: {
    params: {
      hitPoints: 100
    },
    answers: {
      part1: 78,
      part2: 148
    }
  }
}
