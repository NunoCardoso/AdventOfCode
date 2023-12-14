import { Params } from 'aoc.d'

type RuleDecision = {
  type: string
  number: number
}

type Rule = {
  low: RuleDecision
  high: RuleDecision
}

type RobotIndex = Record<string, Array<number>>

type Process = {
  bot: number
  processed: boolean
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const rules: Record<string, Rule> = {}
  const outputs: Record<string, number> = {}
  const botIndex: RobotIndex = {}
  let botIndexWithTwo: Array<Process> = []

  const processRule = (
    bot: string,
    rule: Rule,
    botValues: Array<number>,
    botIndex: any,
    botIndexWithTwo: Array<Process>
  ) => {
    botIndex[bot] = undefined // reset
    ;(['low', 'high'] as Array<keyof Rule>).forEach((key: string) => {
      const ruleDecision = rule[key]
      if (ruleDecision.type === 'bot') {
        const botNumber = ruleDecision.number.toString()
        // update
        if (!Object.prototype.hasOwnProperty.call(botIndex, botNumber) || botIndex[botNumber].length === 0) {
          botIndex[botNumber] = [botValues[key === 'low' ? 0 : 1]]
        } else {
          botIndex[botNumber].push(botValues[key === 'low' ? 0 : 1])
          botIndexWithTwo.push({ bot: ruleDecision.number, processed: false })
        }
      }
      if (ruleDecision.type === 'output') {
        outputs[ruleDecision.number] = botValues[key === 'low' ? 0 : 1]
      }
    })
  }

  for await (const line of lineReader) {
    if (line.startsWith('value')) {
      const m = line.match(/value (\d+) goes to bot (\d+)/)
      const value = parseInt(m[1])
      const bot = parseInt(m[2])
      if (!Object.prototype.hasOwnProperty.call(botIndex, bot)) {
        botIndex[bot.toString()] = [value]
      } else {
        botIndex[bot.toString()].push(value)
        botIndexWithTwo.push({ bot: bot, processed: false })
      }
    }

    if (line.startsWith('bot')) {
      const m = line.match(/bot (\d+) gives low to (.+) (\d+) and high to (.+) (\d+)/)
      rules[m[1]] = {
        low: { type: m[2], number: parseInt(m[3]) },
        high: { type: m[4], number: parseInt(m[5]) }
      }
    }

    // reset for the next rule loaded
    botIndexWithTwo = botIndexWithTwo.map((b) => ({
      ...b,
      processed: false
    }))

    while (_.filter(botIndexWithTwo, { processed: false }).length > 0) {
      for (let i = botIndexWithTwo.length - 1; i >= 0; i--) {
        const { bot, processed } = botIndexWithTwo[i]

        if (!processed) {
          const rule = rules[bot.toString()]
          if (!_.isUndefined(rule)) {
            const botValues: Array<number> = botIndex[bot.toString()].sort((a, b) => (a - b > 0 ? 1 : -1))
            log.debug('Found rule, bot', bot, 'will decide between', botValues)

            const compareBotValues = params.botValues
            if (_.intersection(botValues, compareBotValues).length === compareBotValues.length) {
              part1 = bot
            }

            processRule(bot.toString(), rule, botValues, botIndex, botIndexWithTwo)
            // processed and finished, so remove it
            botIndexWithTwo.splice(i, 1)
          } else {
            // processed but not finished, still waiting for a rule
            botIndexWithTwo[i].processed = true
          }
        }
      }
    }
  }

  part2 = outputs['0'] * outputs['1'] * outputs['2']
  return { part1, part2 }
}
