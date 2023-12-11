import { Params } from 'aoc.d'

type Stat = {
  name: string
  cost: number
  damage: number
  armor: number
}

type Setup = {
  weapon: Stat
  armor: Stat
  ring1: Stat
  ring2: Stat
}

type Char = {
  cost?: number
  hitPoints: number
  damage: number
  armor: number
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const boss: Char = { hitPoints: 0, damage: 0, armor: 0 }

  let weapons: Array<Stat> = []
  let armors: Array<Stat> = []
  let rings: Array<Stat> = []

  for await (const line of lineReader) {
    if (line.match(/Hit Points/)) {
      boss.hitPoints = parseInt(line.match(/Hit Points: (\d+)/)[1])
    }
    if (line.match(/Damage/)) {
      boss.damage = parseInt(line.match(/Damage: (\d+)/)[1])
    }
    if (line.match(/Armor/)) {
      boss.armor = parseInt(line.match(/Armor: (\d+)/)[1])
    }
  }

  weapons = [
    { name: 'Dagger', cost: 8, damage: 4, armor: 0 },
    { name: 'Shortsword', cost: 10, damage: 5, armor: 0 },
    { name: 'Warhammer', cost: 25, damage: 6, armor: 0 },
    { name: 'Longsword', cost: 40, damage: 7, armor: 0 },
    { name: 'Greataxe', cost: 74, damage: 8, armor: 0 }
  ]

  armors = [
    { name: 'None', cost: 0, damage: 0, armor: 0 },
    { name: 'Leather', cost: 13, damage: 0, armor: 1 },
    { name: 'Chainmail', cost: 31, damage: 0, armor: 2 },
    { name: 'Splintmail', cost: 53, damage: 0, armor: 3 },
    { name: 'Bandedmail', cost: 75, damage: 0, armor: 4 },
    { name: 'Platemail', cost: 102, damage: 0, armor: 5 }
  ]

  rings = [
    { name: 'None+1', cost: 0, damage: 0, armor: 0 },
    { name: 'None+2', cost: 0, damage: 0, armor: 0 },
    { name: 'Damage+1', cost: 25, damage: 1, armor: 0 },
    { name: 'Damage+2', cost: 50, damage: 2, armor: 0 },
    { name: 'Damage+3', cost: 100, damage: 3, armor: 0 },
    { name: 'Defense+1', cost: 20, damage: 0, armor: 1 },
    { name: 'Defense+2', cost: 40, damage: 0, armor: 2 },
    { name: 'Defense+3', cost: 80, damage: 0, armor: 3 }
  ]

  const goToBattle = (hero: Char, boss: Char): number => {
    while (hero.hitPoints > 0 && boss.hitPoints > 0) {
      log.debug('Before strike: hero: ', hero, 'boss', boss)
      let heroStrike = hero.damage - boss.armor
      if (heroStrike < 1) {
        heroStrike = 1
      }
      boss.hitPoints -= heroStrike
      if (boss.hitPoints <= 0) {
        return hero.hitPoints
      }
      log.debug('Mid strike: hero: ', hero, 'boss', boss)

      let bossStrike = boss.damage - hero.armor
      if (bossStrike < 1) {
        bossStrike = 1
      }
      hero.hitPoints -= bossStrike
      if (hero.hitPoints <= 0) {
        return hero.hitPoints
      }
      log.debug('End strike: hero: ', hero, 'boss', boss)
    }
    return -9999
  }

  const getHeroWithSetup = (setup: Setup) => {
    return {
      hitPoints: params.hitPoints,
      cost: setup.weapon.cost + setup.armor.cost + setup.ring1.cost + setup.ring2.cost,
      damage: setup.weapon.damage + setup.armor.damage + setup.ring1.damage + setup.ring2.damage,
      armor: setup.weapon.armor + setup.armor.armor + setup.ring1.armor + setup.ring2.armor
    }
  }

  const getCombinations = () => {
    let combinations: Array<Setup> = []
    for (let w = 0; w < weapons.length; w++) {
      for (let a = 0; a < armors.length; a++) {
        for (let r1 = 0; r1 < rings.length - 1; r1++) {
          // no need to do another iteration with only one ring
          if (r1 !== 1) {
            for (let r2 = r1 + 1; r2 < rings.length; r2++) {
              combinations.push({ weapon: weapons[w], armor: armors[a], ring1: rings[r1], ring2: rings[r2] })
            }
          }
        }
      }
    }

    combinations = combinations.sort((a, b) => {
      return a.weapon.cost +
        a.armor.cost +
        a.ring1.cost +
        a.ring2.cost -
        (b.weapon.cost + b.armor.cost + b.ring1.cost + b.ring2.cost) <
        0
        ? -1
        : 1
    })
    return combinations
  }

  const combinations: Array<Setup> = getCombinations()

  log.debug('I have', combinations.length, 'combinations')

  let it = 0

  while (part1 === 0 || part2 === 0) {
    if (part1 === 0) {
      const setup1 = combinations[it]
      const hero1: Char = getHeroWithSetup(setup1)
      const score1 = goToBattle(hero1, { ...boss })
      if (score1 > 0 && part1 === 0) {
        part1 = hero1.cost!
      }
    }
    if (part2 === 0) {
      const setup2 = combinations[combinations.length - 1 - it]
      const hero2: Char = getHeroWithSetup(setup2)
      const score2 = goToBattle(hero2, { ...boss })
      if (score2 < 0 && part2 === 0) {
        part2 = hero2.cost!
      }
    }
    it++
  }

  return { part1, part2 }
}
