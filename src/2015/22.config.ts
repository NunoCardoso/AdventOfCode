import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2015,
    day: 22,
    title: 'Wizard Simulator 20XX',
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4,
    tags: ['Path-finding']
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      params: {
        hitPoints: 10,
        mana: 250,
        spells: ['Poison', 'Magic Missile']
      },
      answers: {
        part1: 173 + 53
      }
    },
    {
      id: 'test2',
      params: {
        hitPoints: 10,
        mana: 250,
        spells: ['Recharge', 'Shield', 'Drain', 'Poison', 'Magic Missile']
      },
      answers: {
        part1: 229 + 113 + 73 + 173 + 53
      }
    }
  ],
  prod: {
    params: {
      hitPoints: 50,
      mana: 500
    },
    answers: {
      part1: 900,
      part2: 1216
    }
  }
}

export default config
