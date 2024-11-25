import { Params } from 'aoc.d'
import { intersect } from 'util/arr'

type Valve = {
  flow: number
  valves: Array<string>
}
type ValveData = Record<string, Valve>
type TunnelMap = Map<string, Map<string, Array<string>>>
type Actor = {
  inValve: string
  remaining?: number
  action: 'start' | 'moving' | 'opening' | 'stay'
}

type Step = {
  human: Actor
  elephant?: Actor
  timeLeft: number
  pressure: number
  pressureIncrease: number
  withElephant: boolean
  valvesVisited: Array<string>
  valvesOpened: Array<string>
}

type Data = {
  highestScore: number
  path: Array<Step>
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  const valveData: ValveData = {}
  // AA does not have flow, but it is necessary for a network between valves with flow
  const valvesWithFlow: Array<string> = ['AA']

  for await (const line of lineReader) {
    const [, name, flow, valves] = line.match(
      /^Valve (.+) has flow rate=(.+); tunnels? leads? to valves? (.+)$/
    )
    valveData[name] = { flow: +flow, valves: valves.split(', ') }
    if (+flow > 0) valvesWithFlow.push(name)
  }

  log.debug('Pipe data', valveData)

  const tunnelsBetweenValvesWithFlow: TunnelMap = new Map()

  const areAllValvesWithFlowOpened = (step: Step): boolean =>
    intersect(step.valvesOpened, valvesWithFlow).length === valvesWithFlow.length

  const printAction = (a: string) =>
    a === 'moving' ? '🚀 ' : a === 'opening' ? '☸️  ' : a === 'stay' ? '🪑 ' : '🚩 '

  const printStep = (s: Step) =>
    '🧍{' +
    printAction(s.human.action) +
    s.human.inValve +
    (!s.human.remaining ? '' : '(+' + s.human.remaining + ')') +
    '}' +
    (s.withElephant
      ? '🐘 {' +
        printAction(s.elephant!.action) +
        s.elephant!.inValve +
        (!s.elephant!.remaining ? '' : '(+' + s.elephant!.remaining + ')') +
        '}'
      : '') +
    '[💨 ' +
    s.pressure +
    '(+' +
    s.pressureIncrease +
    ')][🕗' +
    s.timeLeft +
    ']'

  const searchAlgorithm = (opened: Array<Array<Step>>, data: Data) => {
    const path: Array<Step> = opened.splice(-1)[0]
    const head: Step = path[path.length - 1]
    log.debug('=== Starting ===', head)
    log.debug('opened', opened.length, 'highest', data.highestScore ?? '-')

    if (head.timeLeft === 0) {
      if (head.pressure > data.highestScore) {
        log.debug('Found better pressure', head.pressure)
        data.path = path
        data.highestScore = head.pressure
      }
      return
    }

    const newSteps: Array<Step> = getNewSteps(path, data)

    if (newSteps.length > 0) {
      const __newPaths = filterNonPromisingPaths(newPaths, timeLimit, allValidValves, finished)
      /* if (__newPaths.length !== newPaths.length) {
        log.info("I reduced new paths from", newPaths.length,'to', __newPaths.length)
      } */
      opened.push(...__newPaths)
      opened.sort(
        (a, b) =>
          // orders from least to most, we pick best candidates from end of list
          a.head.pressure +
          a.head.pressureIncrease * (timeLimit - a.head.time) -
          (b.head.pressure + b.head.pressureIncrease * (timeLimit - b.head.time))
      )
    }
    log.debug(
      'Step',
      printStep(path.head),
      'produced',
      newPaths.length,
      'new paths',
      newPaths.map((p) => printStep(p.head))
    )
    log.debug(
      'opened most promising',
      opened.slice(-3).map((p) => JSON.stringify(p.head))
    )
  }

  if (!params.skipPart1) {
    const data: Data = { highestScore: 0, path: [] }
    const opened = [
      [
        {
          human: { inValve: 'AA', action: 'start' },
          timeLeft: params!.limit.part1,
          pressure: 0,
          pressureIncrease: 0,
          withElephant: false,
          valvesVisited: ['AA'],
          valvesOpened: []
        }
      ]
    ]
    let iterations = 0
    while (opened.length > 0) {
      searchAlgorithm(opened, data)
      if (iterations % 100 === 0) {
        log.debug('it', iterations, 'opened length', opened.length)
        iterations++
      }
      if (params.ui?.show && params.ui?.end) data.path.forEach(printStep)
      part1 = data.highestScore
    }
  }

  return { part1, part2 }
}
