import { Params } from 'aoc.d'
import { intersect } from 'util/array'

type RuleDecision = {
  type: string
  number: number
}

type Rule = {
  low: RuleDecision
  high: RuleDecision
}

type RobotIndex = Map<number, Array<number> | undefined>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const rules: Map<number, Rule> = new Map()
  const outputs: Map<number, number> = new Map()
  const botIndex: RobotIndex = new Map()

  const processRule = (bot: number, rule: Rule, botValues: Array<number>, botIndex: RobotIndex, botIndexWithTwo: Array<number>) => {
    botIndex.set(bot, []) // robot will not have the values anymore
    ;(['low', 'high'] as Array<keyof Rule>).forEach((key: string) => {
      // @ts-ignore
      const ruleDecision = rule[key]
      if (ruleDecision.type === 'bot') {
        const botNumber = ruleDecision.number
        // bot does not have a value
        if (!botIndex.has(botNumber) || (botIndex.get(botNumber) ?? []).length === 0) {
          botIndex.set(botNumber, [botValues[key === 'low' ? 0 : 1]])
        } else {
          // bot already have a value, so chain it
          botIndex.get(botNumber)!.push(botValues[key === 'low' ? 0 : 1])
          botIndexWithTwo.push(ruleDecision.number)
        }
      }
      if (ruleDecision.type === 'output') {
        outputs.set(ruleDecision.number, botValues[key === 'low' ? 0 : 1])
      }
    })
  }

  const botIndexWithTwo: Array<number> = []

  for await (const line of lineReader) {
    if (line.startsWith('value')) {
      const [value, bot] = line.match(/\d+/g).map(Number)
      if (!botIndex.has(bot)) botIndex.set(bot, [value])
      else {
        botIndex.get(bot)!.push(value)
        botIndexWithTwo.push(bot)
      }
    }
    if (line.startsWith('bot')) {
      const [, bot, lowType, lowNumber, highType, highHumber] = line.match(/bot (\d+) gives low to (.+) (\d+) and high to (.+) (\d+)/)
      rules.set(+bot, {
        low: { type: lowType, number: +lowNumber },
        high: { type: highType, number: +highHumber }
      })
    }
  }

  while (botIndexWithTwo.length > 0) {
    log.debug('there is a bot with two, ', botIndexWithTwo)
    for (let i = botIndexWithTwo.length - 1; i >= 0; i--) {
      const bot = botIndexWithTwo[i]
      const rule = rules.get(bot)
      if (rule) {
        const botValues: Array<number> = botIndex.get(bot)!.sort((a, b) => (a - b > 0 ? 1 : -1))
        log.debug('Found rule, bot', bot, 'will decide between', botValues)
        if (intersect(botValues, params.botValues).length === params.botValues.length) part1 = bot
        processRule(bot, rule, botValues, botIndex, botIndexWithTwo)
      }
      botIndexWithTwo.splice(i, 1)
    }
  }

  part2 = outputs.get(0)! * outputs.get(1)! * outputs.get(2)!
  return { part1, part2 }
}
