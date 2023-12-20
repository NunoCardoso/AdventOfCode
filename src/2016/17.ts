export default {
  config: {
    year: '2016',
    day: '17'
  },
  logLevel: 'info',
  params: {
    input: 'rrrbmfta'
  },
  test: [
    {
      id: 'test1',
      params: {
        input: 'ihgpwlah'
      },
      answers: {
        part1: 'DDRRRD',
        part2: 370
      }
    },
    {
      id: 'test2',
      params: {
        input: 'kglvqrro'
      },
      answers: {
        part1: 'DDUDRLRRUDRD',
        part2: 492
      }
    },
    {
      id: 'test3',
      params: {
        input: 'ulqzkmiv'
      },
      answers: {
        part1: 'DRURDRUDDLLDLUURRDULRLDUUDDDRR',
        part2: 830
      }
    }
  ],
  prod: {
    answers: {
      part1: 'RLRDRDUDDR',
      part2: 420
    }
  }
}
