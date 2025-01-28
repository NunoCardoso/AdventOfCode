import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Monkey map',
    year: 2022,
    day: 22,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 5
  },
  logLevel: 'info',
  ui: {
    show: false,
    during: true
  },
  test: {
    params: {
      cubeSize: 4,
      edgeBinds: {
        '1-<': [3, '^', 'v', false],
        '1-^': [2, '^', 'v', true],
        '1->': [6, '>', '<', true],
        '2-^': [1, '^', 'v', true],
        '2-<': [6, 'v', '^', true],
        '2-v': [5, 'v', '^', true],
        '3-^': [1, '<', '>', false],
        '3-v': [5, '<', '>', false],
        '4->': [6, '^', 'v', true],
        '5-<': [3, 'v', '^', true],
        '5-v': [2, 'v', '^', true],
        '6-^': [4, '>', '<', true],
        '6->': [1, '>', '<', true],
        '6-v': [2, '<', '>', true]
      }
    },
    id: 'test',
    answers: {
      part1: 6032,
      part2: 5031
    }
  },
  prod: {
    params: {
      cubeSize: 50,
      edgeBinds: {
        '1-v': [3, '>', '<', false],
        '1->': [4, '>', '<', true],
        '1-^': [6, 'v', '^', false],
        '2-<': [5, '<', '>', true],
        '2-^': [6, '<', '>', false],
        '3-<': [5, '^', 'v', false],
        '3->': [1, 'v', '^', false],
        '4-v': [6, '>', '<', false],
        '4->': [1, '>', '<', true],
        '5-<': [2, '<', '>', true],
        '5-^': [3, '<', '>', false],
        '6-<': [2, '^', 'v', false],
        '6-v': [1, '^', 'v', false],
        '6->': [4, 'v', '^', false]
      }
    },
    answers: {
      part1: 149138,
      part2: 153203
    }
  }
}

export default config
