import aoc from 'aoc'

aoc({
  year: '2015',
  day: '22',
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      skip: true,
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
      skip: true,
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
    skip: false,
    params: {
      hitPoints: 50,
      mana: 500
    },
    answers: {
      part1: 900,
      part2: 1216
    }
  }
})
