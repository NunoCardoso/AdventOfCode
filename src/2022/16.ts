import { Params } from 'aoc.d'
import { permutation } from 'util/permutation'

type ValveFlow = Record<string, number>
type ValveMap = Record<string, Record<string, string[]>>

type Agent = {
  name: string
  location: string
  timeLeft: number
  pressureReleased: number
  valvesHandled: string[]
}

type Step = Agent[]

type Data = {
  score: number
  totalTime: number
  bestStep?: Step
  valveFlow: ValveFlow
  valvesWithFlow: string[]
}

type Queue = Step[]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const printAgent = (a: Agent): string =>
    '' +
    a.name +
    '(' +
    a.location +
    ')' +
    '[🕗' +
    a.timeLeft +
    '][💨 ' +
    a.pressureReleased +
    '][☸️' +
    a.valvesHandled.join(',') +
    ']'

  const printStep = (s: Step | undefined): string => s?.map((agent) => printAgent(agent)).join(', ') ?? '-'

  const cloneAgent = (a: Agent) => ({ ...a, valvesHandled: [...a.valvesHandled] })

  const cloneStep = (step: Step) => step.map(cloneAgent)

  // find the shortest path between two valves
  // it will ONLY SEND THE MIDDLE STEPS, the from and to will NOT be included.
  const findShortestPath = (valveStart: string, valveEnd: string, valveMap: ValveMap) => {
    let path: string[] = [valveStart]
    let answer: string[] = []
    log.trace('=== findShortestPath: valveStart', valveStart, 'valveEnd', valveEnd, '===')
    while (answer.length === 0) {
      let newPaths = []
      for (let valve of path) {
        log.trace('findShortestPath: trying valve', valve, 'from path', path)
        let seenValves = valve.split('-')
        let lastValve: string = seenValves.pop()!
        let newValvesMap: Record<string, string[]> = valveMap[lastValve]
        log.trace('findShortestPath: lastValve', lastValve, 'newValvesMap', newValvesMap)

        let unseenOneStepValves: string[] = Object.keys(newValvesMap).filter(
          (key) => valveMap[lastValve][key].length === 1 && !seenValves.includes(key)
        )
        log.trace('findShortestPath: unseenOneStepValves', unseenOneStepValves)
        if (unseenOneStepValves.length > 0) {
          if (unseenOneStepValves.includes(valveEnd)) {
            // do not add valveEnd, remove valveStart from answer.
            // just middle steps
            answer = valve.split('-')
            answer.shift()
            log.trace('findShortestPath: got answer', answer)
            break
          } else {
            newPaths.push(...unseenOneStepValves.map((v) => valve + '-' + v))
          }
        }
      }
      path = newPaths
    }
    return answer
  }

  const getRemainingValves = (step: Step, data: Data) =>
    data.valvesWithFlow.filter((v) => step.every((a) => !a.valvesHandled.includes(v)))

  const hasPotential = (step: Step, data: Data): boolean => {
    log.debug('hasPotential: trying out step', printStep(step))
    if (getPressure(step) > data.score) {
      log.debug('hasPotential: already best')
      return true
    }
    if (step.every((agent) => agent.timeLeft > data.totalTime / 2)) {
      log.debug('hasPotential: too soon to tell')
      return true
    }

    let valvesRemaining = getRemainingValves(step, data)
    log.debug('hasPotential: valvesRemaining: ', valvesRemaining)
    if (valvesRemaining.length === 0) {
      log.debug('hasPotential: no more valves')
      return true
    }
    let newStep = cloneStep(step)
    valvesRemaining.sort((a, b) => data.valveFlow[a] - data.valveFlow[b])
    let iteration = 0
    while (valvesRemaining.length > 0 && newStep.every((agent) => agent.timeLeft > 2)) {
      log.debug(
        'hasPotential: iteration',
        valvesRemaining,
        newStep.map((agent) => agent.timeLeft)
      )
      let targetAgent = iteration % newStep.length // for round-robin valves
      // assume all valve openings has cost of 2 (one move, one opening)
      if (newStep[targetAgent].timeLeft - 2 > 0) {
        let valve = valvesRemaining.pop()!
        log.debug(
          'hasPotential: adding valve',
          valve,
          'more',
          (newStep[targetAgent].timeLeft - 2) * data.valveFlow[valve]
        )
        // no need to sync valvesHandled and valve
        newStep[targetAgent].pressureReleased += (newStep[targetAgent].timeLeft - 2) * data.valveFlow[valve]
        newStep[targetAgent].timeLeft -= 2
        newStep[targetAgent].valvesHandled.push(valve)
      }
    }
    let hasPotential = getPressure(newStep) > data.score
    log.debug(
      'hasPotential conclusion: ',
      hasPotential,
      'step',
      printStep(step),
      'getPressure(newStep)',
      getPressure(newStep),
      'data.score',
      data.score
    )
    return hasPotential
  }

  const getNewSteps = (step: Step, data: Data, valveMap: ValveMap): Step[] => {
    const newSteps: Step[] = []

    let valvesRemaining = getRemainingValves(step, data)

    // case 1: all valves open, nothing to do
    if (valvesRemaining.length === 0) return newSteps

    // TODO case 2: one valve left, 2 agents
    if (valvesRemaining.length === 1 && step.length === 2) {
      return newSteps
    }

    // log.debug('valves remaining', valvesRemaining)
    // case 2: 2+ valve left
    for (let nextValves of permutation(valvesRemaining, step.length)) {
      //  log.debug('nextValves ', nextValves)
      let newStep = cloneStep(step)
      let addedMove: boolean = false

      //log.debug('get new steps: trying valve', nextValves)
      for (let agentIndex = 0; agentIndex < step.length; agentIndex++) {
        let agent = cloneAgent(step[agentIndex])
        let nextValve = nextValves[agentIndex]

        // number of moves = path moves + 1 for opening
        let cost = valveMap[agent.location][nextValve].length + 1
        //log.debug('cost', cost, valveMap[agent.location][nextValve])
        // if we have time
        if (agent.timeLeft > cost) {
          agent.location = nextValve
          agent.pressureReleased += (agent.timeLeft - cost) * valveFlow[nextValve]
          agent.timeLeft -= cost
          agent.valvesHandled.push(nextValve)
          newStep[agentIndex] = agent
          addedMove = true
        }
      }

      if (addedMove) newSteps.push(newStep)
    }

    // filter steps that have no chance of success. That means taking the remaining
    // valves left, open them on 2 steps each
    return newSteps.filter((step) => hasPotential(step, data))
  }

  const getPressure = (step: Step) => step.reduce((acc, agent) => acc + agent.pressureReleased, 0)

  // bigger is better, so bigger numbers go to the end
  const aStarSort = (a: Step, b: Step) => getPressure(a) - getPressure(b)

  const doSearch = (queue: Queue, data: Data, valveMap: ValveMap) => {
    const step: Step = queue.pop()!
    log.debug('=== Starting ===', printStep(step), 'opened', queue.length, 'highest', data.score)

    let pressure = getPressure(step)
    if (data.score < pressure) {
      log.debug('Found better pressure', pressure)
      data.score = pressure
      data.bestStep = step
      // do not return, we may get better pressures from this step
    }

    const newSteps: Step[] = getNewSteps(step, data, valveMap)
    log.debug('Got', newSteps.length, 'steps:')
    newSteps.forEach((s) => log.debug('> ', printStep(s)))
    if (newSteps.length > 0) {
      queue.push(...newSteps)
      queue.sort((a, b) => aStarSort(a, b))
    }
  }

  const solveFor = (
    withElephant: boolean,
    timeLeft: number,
    valvesWithFlow: string[],
    valveFlow: ValveFlow,
    valveMap: ValveMap
  ): number => {
    let start: Step = [
      {
        name: '👨',
        location: 'AA',
        timeLeft,
        pressureReleased: 0,
        valvesHandled: []
      }
    ]
    if (withElephant)
      start.push({
        name: '🐘',
        location: 'AA',
        timeLeft,
        pressureReleased: 0,
        valvesHandled: []
      })

    const data: Data = {
      score: 0,
      totalTime: timeLeft,
      valvesWithFlow,
      valveFlow,
      bestStep: undefined
    }

    const queue: Queue = [start]
    let iterations = 0

    log.debug(
      'Start part with',
      queue.map((s) => printStep(s)),
      data
    )
    while (queue.length > 0) {
      doSearch(queue, data, valveMap)
      iterations++
      if (iterations % 10000 === 0) {
        log.info('it', iterations, 'opened length', queue.length, 'data.score', data.score)
      }
    }
    //if (params.ui?.show && params.ui?.end)
    log.info(printStep(data?.bestStep))
    return data.score
  }

  const valveFlow: ValveFlow = {}
  const valveMap: ValveMap = {}
  const valvesWithFlow: string[] = []

  for await (const line of lineReader) {
    const [, name, flow, connectedValves] = line.match(
      /^Valve (.+) has flow rate=(.+); tunnels? leads? to valves? (.+)$/
    )
    valveFlow[name] = +flow
    if (+flow > 0) valvesWithFlow.push(name)
    if (!valveMap[name]) valveMap[name] = {}
    connectedValves.split(', ').forEach((v: string) => {
      if (!valveMap[v]) valveMap[v] = {}
      valveMap[name][v] = [v]
      valveMap[v][name] = [name]
    })
  }
  // let's fill up the shortest paths the rest of the valve maps between valves with flow plus AA
  // Note that we will include the target valve on the paths.
  // so, valveMap['A']['D'] = ['B', 'C', 'D'], or 3 steps to reach A to D
  ;['AA', ...valvesWithFlow].forEach((valve: string) => {
    let pathsAlreadyKnown = Object.keys(valveMap[valve])
    let remainingValves = [...valvesWithFlow].filter((v) => !pathsAlreadyKnown.includes(v) && v !== valve)
    log.trace('for valve', valve, 'remainingValves', remainingValves)
    for (let otherValve of remainingValves) {
      log.trace('picking other valve', otherValve)
      let path: string[] = findShortestPath(valve, otherValve, valveMap)
      log.trace('path', path)

      valveMap[valve][otherValve] = path.concat([otherValve])
      // shortest path goes both ways
      valveMap[otherValve][valve] = path.concat([valve])
    }
  })

  log.debug('Valve map', valveMap)

  if (!params.skipPart1) part1 = solveFor(false, params!.limit.part1, valvesWithFlow, valveFlow, valveMap)
  if (!params.skipPart2) part2 = solveFor(true, params!.limit.part2, valvesWithFlow, valveFlow, valveMap)

  return { part1, part2 }
}
