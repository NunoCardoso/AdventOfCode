import { Params } from 'aoc.d'

type Stat = {
  name: string
  cost: number
  damage?: number
  duration?: number
  amount?: number
}

type Effect = {
  name: string
  duration: number
  amount: number
}

type Boss = {
  hitPoints: number
  damage: number
}

type Hero = {
  hitPoints: number
  mana: number
}

type Move = {
  hero: Hero
  boss: Boss
  path: string
  manaSpent: number
  description: string
  effects: Array<Effect>
}

type Data = {
  path: Array<Move>
  score: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const boss: Boss = { hitPoints: 0, damage: 0 }

  const spells: Array<Stat> = [
    { name: 'Magic Missile', cost: 53, damage: 4, duration: 1 },
    { name: 'Drain', cost: 73, damage: 2, amount: 2, duration: 1 },
    { name: 'Shield', cost: 113, duration: 6, amount: 7 },
    { name: 'Poison', cost: 173, duration: 6, amount: 3 },
    { name: 'Recharge', cost: 229, duration: 5, amount: 101 }
    // { name: 'Nothing', cost: 0 },
  ]

  for await (const line of lineReader) {
    if (line.match(/Hit Points/)) {
      boss.hitPoints = parseInt(line.match(/Hit Points: (\d+)/)[1])
    }
    if (line.match(/Damage/)) {
      boss.damage = parseInt(line.match(/Damage: (\d+)/)[1])
    }
  }

  const isFinished = (move: Move): boolean => {
    return move.hero.hitPoints <= 0 || move.boss.hitPoints <= 0
  }

  const heroWon = (move: Move): boolean => {
    return move.hero.hitPoints > 0 && move.boss.hitPoints <= 0
  }

  const applyEffects = (nextMove: Move) => {
    let heroDamage = 0
    let heroArmor = 0
    let recharge = 0

    // execute hero effects
    for (let i = nextMove.effects.length - 1; i >= 0; i--) {
      const effect = nextMove.effects[i]

      if (effect.name === 'Magic Missile') {
        nextMove.boss.hitPoints -= 4
        nextMove.effects[i].duration--
        if (nextMove.effects[i].duration === 0) {
          nextMove.effects.splice(i, 1)
        }
      }
      if (effect.name === 'Drain') {
        nextMove.boss.hitPoints -= 2
        nextMove.hero.hitPoints += effect.amount
        nextMove.effects[i].duration--
        if (nextMove.effects[i].duration === 0) {
          nextMove.effects.splice(i, 1)
        }
      }
      if (effect.name === 'Shield') {
        heroArmor += effect.amount
        nextMove.effects[i].duration--
        if (nextMove.effects[i].duration === 0) {
          nextMove.effects.splice(i, 1)
        }
      }
      if (effect.name === 'Poison') {
        heroDamage += effect.amount
        nextMove.effects[i].duration--
        if (nextMove.effects[i].duration === 0) {
          nextMove.effects.splice(i, 1)
        }
      }
      if (effect.name === 'Recharge') {
        recharge += effect.amount
        nextMove.effects[i].duration--
        if (nextMove.effects[i].duration === 0) {
          nextMove.effects.splice(i, 1)
        }
      }
    }

    return { heroArmor, heroDamage, recharge }
  }
  const getNextMoves = (data: Data, moves: Array<Move>, mode: string): Array<Array<Move>> => {
    const nextMove = { ...moves[moves.length - 1] }
    const nextMoves: Array<Array<Move>> = []

    if (mode === 'part2') {
      nextMove.hero.hitPoints = nextMove.hero.hitPoints - 1
      if (nextMove.hero.hitPoints <= 0) return nextMoves
    }

    // player turn: apply effects before casting a spell
    const stats = applyEffects(nextMove)

    log.debug('-- Player turn --')

    log.debug(
      '- Player has',
      nextMove.hero.hitPoints,
      'hit points,',
      stats.heroArmor,
      'armor,',
      nextMove.hero.mana,
      'mana'
    )
    log.debug('- Boss has', nextMove.boss.hitPoints, 'hit points')

    nextMove.boss.hitPoints = nextMove.boss.hitPoints - stats.heroDamage
    log.debug('- Player effects deal damage', stats.heroDamage)
    log.debug('- Effects:', nextMove.effects)

    // boss dead, no need to spend mana
    if (nextMove.boss.hitPoints <= 0) {
      nextMoves.push(moves.concat(nextMove))
      return nextMoves
    }

    const spellsToCast: Array<Stat> = []
    if (params.isTest && Array.isArray(params.spells) && params.spells.length > 0) {
      const _spell = params.spells.shift()
      const spellFound = spells.find((spell) => spell.name === _spell)
      if (spellFound) {
        spellsToCast.push(spellFound)
        log.debug('- Testing: pushing only one spell', _spell)
      }
    } else {
      spells.forEach((spell) => {
        if (
          spell.cost < nextMove.hero.mana &&
          !nextMove.effects.find((effect) => effect.name === spell.name) &&
          (spell.name !== 'Nothing' || (spell.name === 'Nothing' && nextMove.path.length > 9))
        ) {
          spellsToCast.push(spell)
        }
      })
    }

    spellsToCast.forEach((spell: Stat) => {
      // If I have mana and spell is not casted already and for the "nothing", do it after step 5
      const _nextMove = global.structuredClone(nextMove)

      if (typeof spell.duration === 'number') {
        _nextMove.effects.push({
          name: spell.name,
          amount: spell.amount ?? 0,
          duration: spell.duration ?? 0
        })
      }

      _nextMove.hero.mana -= spell.cost
      _nextMove.manaSpent += spell.cost
      _nextMove.description = 'Player casts ' + spell.name
      _nextMove.path = _nextMove.path + '-' + spell.name[0]

      log.debug(_nextMove.description)
      log.debug('')

      //  do not execute if it was casted now
      if (spell.name !== 'Recharge') {
        log.debug('- Adding recharge', stats.recharge)
        _nextMove.hero.mana += stats.recharge
      }

      log.debug('-- Boss turn --')

      // apply effects before player does a spell
      const props = applyEffects(_nextMove)

      log.debug(
        '- Player has',
        _nextMove.hero.hitPoints,
        'hit points,',
        props.heroArmor,
        'armor,',
        _nextMove.hero.mana,
        'mana'
      )
      log.debug('- Boss has', _nextMove.boss.hitPoints, 'hit points')

      _nextMove.boss.hitPoints = _nextMove.boss.hitPoints - props.heroDamage
      log.debug('- Player effects deal damage', props.heroDamage)
      log.debug('- Effects:', _nextMove.effects)

      if (_nextMove.boss.hitPoints > 0) {
        log.debug('- Boss attacks for', _nextMove.boss.damage, 'damage')
        const bossDamage =
          _nextMove.boss.damage - props.heroArmor > 1 ? _nextMove.boss.damage - props.heroArmor : 1
        _nextMove.hero.hitPoints -= bossDamage
      }

      //  do not execute if it was casted now
      if (props.recharge > 0) {
        log.debug('- Adding recharge', props.recharge)
        _nextMove.hero.mana += props.recharge
      }

      // do not add next move if it can't beat high score
      if (data.score > _nextMove.manaSpent) {
        nextMoves.push(moves.concat(_nextMove))
      }
    })

    return nextMoves
  }

  const goToBattle = (opened: Array<Array<Move>>, data: Data, mode: string) => {
    const move: Array<Move> = opened.splice(-1)[0]
    const latestMove = move[move.length - 1]

    if (isFinished(latestMove)) {
      if (heroWon(latestMove)) {
        log.debug('Player won with', latestMove.manaSpent)
        if (latestMove.manaSpent < data.score) {
          log.debug('Movie has a high score', latestMove.manaSpent, 'old score', data.score)
          data.score = latestMove.manaSpent
          data.path = move
        }
      }
    } else {
      const newMoves: Array<Array<Move>> = getNextMoves(data, move, mode)
      log.debug('Got', newMoves.length, 'moves')
      opened.push(...newMoves)
      opened.sort((a, b) => {
        return a[a.length - 1].manaSpent - b[b.length - 1].manaSpent > 0
          ? 1
          : a[a.length - 1].boss.hitPoints - b[b.length - 1].boss.hitPoints > 0
            ? 1
            : -1
      })
    }
  }

  const solveFor = (mode: string) => {
    const data = {
      score: 9999,
      path: []
    }

    const opened: Array<Array<Move>> = [
      [
        {
          hero: {
            mana: params.mana,
            hitPoints: params.hitPoints
          },
          boss: { ...boss },
          manaSpent: 0,
          path: 's',
          description: 'start',
          effects: []
        }
      ]
    ]
    while (opened.length > 0) {
      goToBattle(opened, data, mode)
    }
    log.debug('Final path', data.path)
    return data.score
  }

  part1 = solveFor('part1')
  part2 = solveFor('part2')

  return { part1, part2 }
}
