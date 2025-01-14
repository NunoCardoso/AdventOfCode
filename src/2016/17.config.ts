import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Two Steps Forward',
    year: 2016,
    day: 17,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    tags: ['Path-finding'],
    difficulty: 2
  },
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

export default config
