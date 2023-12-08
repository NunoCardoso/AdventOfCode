import aoc from 'aoc'

aoc({
  year: '2016',
  day: '17',
  logLevel: 'debug',
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
        part2: 0
      }
    },
    {
      skip: true,
      id: 'test2',
      params: {
        input: 'kglvqrro'
      },
      answers: {
        part1: 'DDUDRLRRUDRD',
        part2: 0
      }
    },
    {
      skip: true,
      id: 'test3',
      params: {
        input: 'ulqzkmiv'
      },
      answers: {
        part1: 'DRURDRUDDLLDLUURRDULRLDUUDDDRR',
        part2: 0
      }
    }
  ],
  prod: {
    skip: true,
    answers: {
      part1: 0,
      part2: 0
    }
  }
})
