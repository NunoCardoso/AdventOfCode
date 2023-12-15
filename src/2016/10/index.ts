import { Params } from 'aoc.d'
import { intersect } from 'util/arr'

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
  const outputs: Record<string, number> = {}
  const botIndex: RobotIndex = new Map()

  const processRule = (
    bot: number,
    rule: Rule,
    botValues: Array<number>,
    botIndex: RobotIndex,
    botIndexWithTwo: Array<number>
  ) => {
    botIndex.set(bot, undefined) // reset
    ;(['low', 'high'] as Array<keyof Rule>).forEach((key: string) => {
      // @ts-ignore
      const ruleDecision = rule[key]
      if (ruleDecision.type === 'bot') {
        const botNumber = ruleDecision.number.toString()
        // update
        if (
          !Object.prototype.hasOwnProperty.call(botIndex, botNumber) ||
          (botIndex.get(botNumber) ?? []).length === 0
        ) {
          botIndex.set(botNumber, [botValues[key === 'low' ? 0 : 1]])
        } else {
          botIndex.get(botNumber)!.push(botValues[key === 'low' ? 0 : 1])
          botIndexWithTwo.push([ruleDecision.number, false])
        }
      }
      if (ruleDecision.type === 'output') {
        outputs[ruleDecision.number] = botValues[key === 'low' ? 0 : 1]
      }
    })
  }

  for await (const line of lineReader) {
    const botIndexWithTwo: Array<number> = []
    if (line.startsWith('value')) {
      const [value, bot] = line.match(/\d+/g).map(Number)
      if (!botIndex.has(bot)) botIndex.set(bot, [value])
      else {
        botIndex.get(bot)!.push(value)
        botIndexWithTwo.push(bot)
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

    while (botIndexWithTwo.length > 0) {
      for (let i = botIndexWithTwo.length - 1; i >= 0; i--) {
        const [bot, processed] = botIndexWithTwo[i]

        if (!processed) {
          const rule = rules.get(bot)
          if (rule !== undefined) {
            const botValues: Array<number> = botIndex.get(bot)!.sort((a, b) => (a - b > 0 ? 1 : -1))
            log.debug('Found rule, bot', bot, 'will decide between', botValues)

            const compareBotValues = params.botValues
            if (intersect(botValues, compareBotValues).length === compareBotValues.length) {
              part1 = bot
            }

            processRule(bot, rule, botValues, botIndex, botIndexWithTwo)
            // processed and finished, so remove it
            botIndexWithTwo.splice(i, 1)
          } else {
            // processed but not finished, still waiting for a rule
            botIndexWithTwo[i][1] = true
          }
        }
      }
    }
  }

  part2 = outputs['0'] * outputs['1'] * outputs['2']
  return { part1, part2 }
}
