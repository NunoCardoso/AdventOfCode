export default {
  config: {
    year: '2017',
    day: '16',
    title: 'Permutation Promenade',
    status: 'done',
    comment: 'typical have-to-find-a-delta so I can skip 10000000 iterations. Nice',
    difficulty: 3
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
