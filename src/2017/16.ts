export default {
  config: {
    year: '2017',
    day: '16',
    title: 'Permutation Promenade',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      programs: 'abcde'.split('')
    },
    answers: {
      part1: 'baedc'
    }
  },
  prod: {
    params: {
      programs: 'abcdefghijklmnop'.split('')
    },
    answers: {
      part1: 'gkmndaholjbfcepi',
      part2: 'abihnfkojcmegldp'
    }
  }
}
