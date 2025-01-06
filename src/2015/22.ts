import { Params } from 'aoc.d'

type Spell = {
  name: string
  cost: number
  damage?: number
  duration?: number
  amount?: number
}

type Move = {
  bossDamage: number
  bossHitPoints: number
  heroHitPoints: number
  heroMana: number
  heroArmor: number
  heroArmorDuration: number
  heroDamage: number
  heroDamageDuration: number
  heroManaIncrease: number
  heroManaDuration: number
  manaSpent: number
  description: string
}

type Boss = {
  hitPoints: number
  damage: number
}

type Path = Move[]

type Data = {
  path: Path
}

const spells: Spell[] = [
  { name: 'Magic Missile', cost: 53, damage: 4 },
  { name: 'Drain', cost: 73, damage: 2, amount: 2 },
  { name: 'Shield', cost: 113, duration: 6, amount: 7 },
  { name: 'Poison', cost: 173, duration: 6, amount: 3 },
  { name: 'Recharge', cost: 229, duration: 5, amount: 101 }
]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const boss: Boss = { hitPoints: 0, damage: 0 }

  for await (const line of lineReader) {
    if (line.match(/Hit Points/)) boss.hitPoints = +line.match(/Hit Points: (\d+)/)[1]
    if (line.match(/Damage/)) boss.damage = +line.match(/Damage: (\d+)/)[1]
  }

  const isFinished = (move: Move): boolean => move.heroHitPoints <= 0 || move.bossHitPoints <= 0
  const heroWon = (move: Move): boolean => move.heroHitPoints > 0 && move.bossHitPoints <= 0
  const heroLost = (move: Move): boolean => move.heroHitPoints <= 0 && move.bossHitPoints > 0

  const printMove = (move: Move) =>
    `🦸: ❤️(${move.heroHitPoints}),⚔️(${move.heroDamage}),🛡(${move.heroArmor}),🔮(${move.heroMana})` +
    `⏱️[⚔️${move.heroDamageDuration},🛡${move.heroArmorDuration},🔮${move.heroManaDuration}]` +
    `    🧌: ❤️(${move.bossHitPoints}),⚔️(${move.bossDamage}),💲(${move.manaSpent}),${move.description}`

  const printBattle = (path: Move[]) => path.map(printMove).join('\n')

  const applyEffects = (move: Move) => {
    if (move.heroArmorDuration > 0) {
      move.heroArmor = 7
      move.heroArmorDuration--
    } else {
      move.heroArmor = 0
    }
    if (move.heroDamageDuration > 0) {
      move.heroDamage = 3
      move.bossHitPoints -= 3
      move.heroDamageDuration--
    } else {
      move.heroDamage = 0
    }
    if (move.heroManaDuration > 0) {
      move.heroMana += 101
      move.heroManaDuration--
    }
  }

  const getNextMoves = (move: Move, data: Data, mode: string): Move[] => {
    const nextMoves: Move[] = []

    if (mode === 'part2') {
      move.heroHitPoints--
      log.trace('Part 2 - hero - 1 health, now is', move.heroHitPoints)
      if (heroLost(move)) return nextMoves
    }

    // apply effects before casting a spell. Remove expired ones
    applyEffects(move)
    // boss dead, no need to spend mana
    if (heroWon(move)) {
      log.trace('Boss dead from poison effects!')
      nextMoves.push(move)
      return nextMoves
    }

    log.trace('-- Next move: Hero turn --')
    log.trace(printMove(move))

    const nextSpells: Spell[] = []
    // to do the test, we will follow the spells given in the example
    if (params.isTest && params.spells?.length > 0) {
      let _spell = params.spells.shift()
      const spellFound = spells.find((spell) => spell.name === _spell)!
      nextSpells.push(spellFound)
      log.trace('- Testing: pushing only one spell', spellFound)
    } else {
      spells.forEach((spell) => {
        if (spell.cost <= move.heroMana) {
          let spellNotInUse =
            spell.name === 'Poison'
              ? move.heroDamageDuration === 0
              : spell.name === 'Shield'
                ? move.heroArmorDuration === 0
                : spell.name === 'Recharge'
                  ? move.heroManaDuration === 0
                  : true
          if (spellNotInUse) nextSpells.push(spell)
        }
      })
      // If we do nothing as an option, we actually get a better score!
      /*if (move.heroDamageDuration > 0 ||  move.heroArmorDuration > 0 || move.heroManaDuration > 0) {
        nextSpells.push({ name: 'Nothing', cost: 0 })
      }*/
    }
    log.debug(
      'Available spells for',
      printMove(move),
      nextSpells.map((s) => s.name)
    )
    nextSpells?.forEach((spell: Spell) => {
      const nextMove = {
        ...move,
        description: spell.name,
        manaSpent: move.manaSpent + spell.cost,
        heroMana: move.heroMana - spell.cost
      }

      if (spell.name === 'Shield') nextMove.heroArmorDuration = spell.duration!
      else if (spell.name === 'Poison') nextMove.heroDamageDuration = spell.duration!
      else if (spell.name === 'Recharge') nextMove.heroManaDuration = spell.duration!
      else if (spell.name === 'Magic Missile') nextMove.bossHitPoints -= 4
      else if (spell.name === 'Drain') {
        nextMove.bossHitPoints -= spell.damage!
        nextMove.heroHitPoints += spell.amount!
      }

      if (heroWon(nextMove)) {
        log.trace('Boss dead, will not even play this round!')
        nextMoves.push(nextMove)
        return
      }

      applyEffects(nextMove)

      if (heroWon(nextMove)) {
        log.trace('Boss dead from poison effects, no need to spend more mana')
        nextMoves.push(nextMove)
        return nextMoves
      }

      log.trace('-- Next move: Boss turn --')
      log.trace(printMove(nextMove))

      let bossDamage = nextMove.bossDamage - nextMove.heroArmor
      if (bossDamage < 1) bossDamage = 1
      nextMove.heroHitPoints -= bossDamage
      // do not add this next move if it can't beat high score
      if (data.path.length === 0 || data.path[data.path.length - 1].manaSpent > nextMove.manaSpent)
        nextMoves.push(nextMove)
    })

    return nextMoves
  }

  // first the least amount of mana spent. Second, the least amount of boss health
  const sortMoves = (a: Move[], b: Move[]) =>
    a[a.length - 1].manaSpent - b[b.length - 1].manaSpent > 0
      ? 1
      : a[a.length - 1].bossHitPoints - b[b.length - 1].bossHitPoints > 0
        ? 1
        : -1

  const goToBattle = (queue: Path[], data: Data, mode: string) => {
    const path: Path = queue.pop()!
    const head = path[path.length - 1]

    log.debug('-- Next in queue: --')
    log.debug(printBattle(path))

    if (isFinished(head)) {
      if (heroWon(head)) {
        log.debug('Player won with', head.manaSpent)
        let score = data.path.length > 0 ? data.path[data.path.length - 1].manaSpent : Number.MAX_VALUE
        if (head.manaSpent < score) {
          log.debug('Move has a high score', head.manaSpent, 'old score', score)
          data.path = path
        }
      }
      return
    }
    getNextMoves(head, data, mode).forEach((newMove) => queue.push([...path, newMove]))
    queue.sort(sortMoves)
  }

  const solveFor = (mode: string) => {
    const data: Data = { path: [] }
    const queue: Path[] = [
      [
        {
          bossHitPoints: boss.hitPoints,
          bossDamage: boss.damage,
          heroMana: params.mana,
          heroHitPoints: params.hitPoints,
          heroArmor: 0,
          heroArmorDuration: 0,
          heroDamage: 0,
          heroDamageDuration: 0,
          heroManaIncrease: 0,
          heroManaDuration: 0,
          manaSpent: 0,
          description: 'start'
        }
      ]
    ]
    while (queue.length > 0) goToBattle(queue, data, mode)
    log.debug('Final path')
    log.debug(printBattle(data.path))
    return data.path[data.path.length - 1]?.manaSpent
  }

  part1 = solveFor('part1')
  part2 = solveFor('part2')

  return { part1, part2 }
}
