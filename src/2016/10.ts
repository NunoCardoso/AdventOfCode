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

type RuleKey = keyof Rule

type Rules = Map<number, Rule>
type Outputs = Map<number, number>
type RobotIndex = Map<number, number[] | undefined>
const ruleKeys: RuleKey[] = ['low', 'high']

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const rules: Rules = new Map()
  const outputs: Outputs = new Map()
  const botIndex: RobotIndex = new Map()
  const botIndexWithTwoMicrochips: number[] = []

  const processRule = (
    bot: number,
    rule: Rule,
    botValues: number[],
    botIndex: RobotIndex,
    botIndexWithTwo: number[]
  ) => {
    botIndex.set(bot, []) // robot will not have the values anymore
    ruleKeys.forEach((key: RuleKey) => {
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

  for await (const line of lineReader) {
    if (line.startsWith('value')) {
      const [value, bot] = line.match(/\d+/g).map(Number)
      if (!botIndex.has(bot)) botIndex.set(bot, [value])
      else {
        botIndex.get(bot)!.push(value)
        botIndexWithTwoMicrochips.push(bot)
      }
    }
    if (line.startsWith('bot')) {
      const [, bot, lowType, lowNumber, highType, highHumber] = line.match(
        /bot (\d+) gives low to (.+) (\d+) and high to (.+) (\d+)/
      )
      rules.set(+bot, {
        low: { type: lowType, number: +lowNumber },
        high: { type: highType, number: +highHumber }
      })
    }
  }

  while (botIndexWithTwoMicrochips.length > 0) {
    const bot = botIndexWithTwoMicrochips.pop()!
    const rule = rules.get(bot)!
    const botValues: number[] = botIndex.get(bot)!.sort((a, b) => (a - b > 0 ? 1 : -1))
    if (intersect(botValues, params.botValues).length === params.botValues.length) part1 = bot
    processRule(bot, rule, botValues, botIndex, botIndexWithTwoMicrochips)
  }

  part2 = outputs.get(0)! * outputs.get(1)! * outputs.get(2)!
  return { part1, part2 }
}
