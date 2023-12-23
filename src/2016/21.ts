export default {
  config: {
    year: '2016',
    day: '21',
    title: 'Scrambled Letters and Hash',
    comment: 'Clever that we have to reverse instructions AND the output'
  },
  test: {
    id: 'test',
    params: {
      password: {
        part1: 'abcde',
        part2: 'decab'
      }
    },
    answers: {
      part1: 'decab',
      part2: 'abcde'
    }
  },
  prod: {
    params: {
      password: {
        part1: 'abcdefgh',
        part2: 'fbgdceah'
      }
    },
    answers: {
      part1: 'cbeghdaf',
      part2: 'bacdefgh'
    }
  }
}
