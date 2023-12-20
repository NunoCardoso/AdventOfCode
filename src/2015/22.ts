export default {
  config: {
    year: '2015',
    day: '22',
    comment:
      'if I let Nothing to be an action, then I get a lower value for part 2 (987) than the answer (1216)'
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
