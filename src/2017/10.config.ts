import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Knot Hash',
    year: 2017,
    day: 10,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  test: [
    {
      id: 'test1',
      params: {
        size: 5
      },
      answers: {
        part1: 12
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 'a2582a3a0e66e6e86e3812dcb672a272'
      }
    },
    {
      id: 'test3',
      answers: {
        part2: '33efeb34ea91902bb2f59c9920caa6cd'
      }
    },
    {
      id: 'test4',
      answers: {
        part2: '3efbe78a8d82f29979031a4aa0b16a9d'
      }
    },
    {
      id: 'test5',
      answers: {
        part2: '63960835bcdc130f0b66d7ff4f6a5a8e'
      }
    }
  ],
  prod: {
    answers: {
      part1: 38628,
      part2: 'e1462100a34221a7f0906da15c1c979a'
    }
  }
}

export default config
