import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })
  type Valve = {
    name: string
    flow: number
    valves: Array<string>
  }
  type Cost = {
    name?: string
    time: number
    valves: Array<string>
  }
  type Data = Record<string, Valve>
  type BetterData = Record<string, Record<string, Cost>>
  type Step = {
    human: {
      valve: string
      remaining?: number
      action: 'start' | 'moving' | 'opening' | 'stay'
    }
    elephant:
      | {
          valve: string
          remaining?: number
          action: 'start' | 'moving' | 'opening' | 'stay'
        }
      | undefined
    time: number
    pressure: number
    pressureIncrease: number
    withElephant: boolean
    valvesOpened: Array<string>
  }
  type Steps = Array<Step>
  type Path = {
    head: Step
    tail: Steps
  }
  type Paths = Array<Path>

  const data: Data = {}

  const areAllValvesOpened = (path: Path, valves: Array<string>): boolean =>
    _.intersection(path.head.valvesOpened, valves).length === valves.length

  const printAction = (a: string) =>
    a === 'moving' ? '🚀 ' : a === 'opening' ? '☸️  ' : a === 'stay' ? '🪑 ' : '🚩 '

  const printStep = (s: Step) =>
    '🧍{' +
    printAction(s.human.action) +
    s.human.valve +
    (_.isNil(s.human.remaining) ? '' : '(+' + s.human.remaining + ')') +
    '}' +
    (s.withElephant
      ? '🐘 {' +
        printAction(s.elephant!.action) +
        s.elephant!.valve +
        (_.isNil(s.elephant!.remaining) ? '' : '(+' + s.elephant!.remaining + ')') +
        '}'
      : '') +
    '[💨 ' +
    s.pressure +
    '(+' +
    s.pressureIncrease +
    ')][🕗' +
    s.time +
    ']'

  const generateStep = ({
    head,
    tail,
    nextValve,
    human,
    elephant,
    time
  }: {
    head: Step
    tail: Steps
    nextValve: Array<string>
    time: number
    human: any
    elephant: any
  }): Path => {
    return {
      head: {
        ...head,
        human: human,
        elephant: elephant,
        time: head.time + time,
        pressureIncrease:
          head.pressureIncrease +
          _.reduce(nextValve, (memo: number, val: string) => memo + data[val].flow, 0),
        pressure: head.pressure + time * head.pressureIncrease,
        valvesOpened: head.valvesOpened.concat(nextValve)
      },
      tail: tail
    }
  }

  const makeNewPaths = ({
    path,
    allValidValves,
    timeLimit,
    betterData
  }: {
    path: Path
    allValidValves: Array<string>
    timeLimit: number
    betterData: BetterData
  }) => {
    if (path.head.time >= timeLimit) {
      return []
    }

    const newTail: Steps = path.tail.concat(path.head)
    const newPaths: Paths = []

    if (areAllValvesOpened(path, allValidValves)) {
      log.debug('make new paths:', path?.tail.map(printStep).join(' '))
      log.debug('All valves opened, adding one step with🧍🪑, 🐘🪑 for more time', timeLimit - path.head.time)
      const time = timeLimit - path.head.time
      const p = generateStep({
        head: path.head,
        tail: newTail,
        nextValve: [],
        time: time,
        human: { action: 'stay', valve: path.head.human.valve },
        elephant: path.head.withElephant ? { action: 'stay', valve: path.head.elephant!.valve } : undefined
      })
      newPaths.push(p)
      log.debug('I produced', JSON.stringify(p.head))
      return newPaths
    }

    if (!path.head.withElephant) {
      // get all unseen valves ordered by flow
      _.reject(allValidValves, (v: string) => {
        if (path.head.valvesOpened.indexOf(v) >= 0) {
          return true
        }
        const time = betterData[path.head.human.valve][v].time
        if (path.head.time + time + 1 > timeLimit) {
          return true
        }
        return false
      })
        .sort((a: string, b: string) => data[b].flow - data[a].flow)
        .forEach((nextValve: string) => {
          const time: number = betterData[path.head.human.valve][nextValve].time + 1
          log.debug('make new paths:', path?.tail.map(printStep).join(' '))
          log.debug('Adding step with 🧍☸️ ', nextValve, 'time', time)
          const p = generateStep({
            head: path.head,
            tail: newTail,
            nextValve: [nextValve],
            time: time,
            human: { action: 'opening', valve: nextValve },
            elephant: undefined
          })
          newPaths.push(p)
          log.debug('I produced', JSON.stringify(p.head))
        })
      return newPaths
    }

    const remainingValves: Array<string> = _.reject(allValidValves, (v: string) => {
      if (path.head.valvesOpened.indexOf(v) >= 0) {
        return true
      }
      if (path.head.human.action === 'moving' && v === path.head.human.valve) {
        return true
      }
      if (path.head.elephant?.action === 'moving' && v === path.head.elephant?.valve) {
        return true
      }
      return false
    })

    remainingValves.sort((a: string, b: string) => data[b].flow - data[a].flow)

    const isHumanAvailable: boolean =
      path.head.human.action === 'opening' || path.head.human.action === 'start'
    const isElephantAvailable: boolean =
      path.head.elephant!.action === 'opening' || path.head.elephant!.action === 'start'
    const isHumanDone: boolean = path.head.human.action === 'stay'
    const isElephantDone: boolean = path.head.elephant!.action === 'stay'

    const remainingValvesForHuman = _.reject(remainingValves, (v: string) => {
      // console.log(path.head, v, remainingValves)
      const time = betterData[path.head.human.valve][v].time
      return path.head.time + time + 1 > timeLimit
    })

    const remainingValvesForElephant = _.reject(remainingValves, (v: string) => {
      const time = betterData[path.head.elephant!.valve][v].time
      return path.head.time + time + 1 > timeLimit
    })

    if (isHumanAvailable && !isElephantAvailable) {
      let elephantTime: number = 0
      let elephantAction: string = path.head.elephant!.action
      const _nextValve: Array<string> = []
      if (path.head.elephant!.action === 'stay') {
        elephantTime = timeLimit - path.head.time
      }
      if (path.head.elephant!.action === 'moving') {
        elephantAction = 'opening'
        _nextValve.push(path.head.elephant!.valve)
        elephantTime = path.head.elephant?.remaining ?? 0
      }

      if (_.isEmpty(remainingValvesForHuman)) {
        log.debug('make new paths:', path?.tail.map(printStep).join(' '))
        log.debug('only human available, and no available valves, 🧍🪑, time', elephantTime)
        const p = generateStep({
          head: path.head,
          tail: newTail,
          time: elephantTime,
          nextValve: _nextValve,
          human: { action: 'stay', valve: path.head.human.valve },
          elephant: { action: elephantAction, valve: path.head.elephant!.valve }
        })
        newPaths.push(p)
        log.debug('I produced', JSON.stringify(p.head))
      } else {
        remainingValvesForHuman.forEach((nextValve: string) => {
          const humanTime = betterData[path.head.human.valve][nextValve].time + 1
          const humanAction = humanTime > elephantTime ? 'moving' : 'opening'
          const elephantAction = elephantTime > humanTime ? 'moving' : 'opening'
          let humanRemaining: number = 0
          let elephantRemaining: number = 0
          const _nextValve = []
          if (humanAction === 'moving') {
            humanRemaining = humanTime - elephantTime
          } else {
            _nextValve.push(nextValve)
          }
          if (elephantAction === 'moving') {
            elephantRemaining = elephantTime - humanTime
          } else {
            _nextValve.push(path.head.elephant!.valve)
          }
          const time = Math.min(humanTime, elephantTime)
          log.debug('make new paths:', path?.tail.map(printStep).join(' '))
          log.debug(
            'only human available, human time',
            humanTime,
            'elephant time',
            elephantTime,
            'valve',
            nextValve,
            'human action',
            humanAction,
            'humanRemaining',
            humanRemaining,
            'elephantAction',
            elephantAction,
            'elephantRemaining',
            elephantRemaining,
            'time',
            time
          )

          const p = generateStep({
            head: path.head,
            tail: newTail,
            time: time,
            nextValve: _nextValve,
            human: { action: humanAction, valve: nextValve, remaining: humanRemaining },
            elephant: {
              action: elephantAction,
              valve: path.head.elephant!.valve,
              remaining: elephantRemaining
            }
          })
          newPaths.push(p)
          log.debug('I produced', JSON.stringify(p.head))
        })
      }
      return newPaths
    }

    if (!isHumanAvailable && isElephantAvailable) {
      let humanTime: number = 0
      let humanAction: string = path.head.human!.action
      const _nextValve: Array<string> = []
      if (path.head.human!.action === 'stay') {
        humanTime = timeLimit - path.head.time
      }
      if (path.head.human!.action === 'moving') {
        humanAction = 'opening'
        _nextValve.push(path.head.human!.valve)
        humanTime = path.head.human?.remaining ?? 0
      }

      if (_.isEmpty(remainingValvesForElephant)) {
        log.debug('make new paths:', path?.tail.map(printStep).join(' '))
        log.debug('only elephant available, and no available valves, 🐘🪑, time', humanTime)
        const p = generateStep({
          head: path.head,
          tail: newTail,
          time: humanTime,
          nextValve: _nextValve,
          human: { action: humanAction, valve: path.head.human.valve },
          elephant: { action: 'stay', valve: path.head.elephant!.valve }
        })
        newPaths.push(p)
        log.debug('I produced', JSON.stringify(p.head))
      } else {
        remainingValvesForElephant.forEach((nextValve: string) => {
          const elephantTime = betterData[path.head.elephant!.valve][nextValve].time + 1
          const elephantAction = elephantTime > humanTime ? 'moving' : 'opening'
          const humanAction = humanTime > elephantTime ? 'moving' : 'opening'
          let humanRemaining: number = 0
          let elephantRemaining: number = 0
          const _nextValve = []
          if (humanAction === 'moving') {
            humanRemaining = humanTime - elephantTime
          } else {
            _nextValve.push(path.head.human.valve)
          }
          if (elephantAction === 'moving') {
            elephantRemaining = elephantTime - humanTime
          } else {
            _nextValve.push(nextValve)
          }
          const time = Math.min(humanTime, elephantTime)
          log.debug('make new paths:', path?.tail.map(printStep).join(' '))
          log.debug(
            'only elephant available, human time',
            humanTime,
            'elephant time',
            elephantTime,
            'valve',
            nextValve,
            'human action',
            humanAction,
            'humanRemaining',
            humanRemaining,
            'elephantAction',
            elephantAction,
            'elephantRemaining',
            elephantRemaining,
            'time',
            time
          )

          const p = generateStep({
            head: path.head,
            tail: newTail,
            time: time,
            nextValve: _nextValve,
            human: { action: humanAction, valve: path.head.human.valve, remaining: humanRemaining },
            elephant: { action: elephantAction, valve: nextValve, remaining: elephantRemaining }
          })
          newPaths.push(p)
          log.debug('I produced', JSON.stringify(p.head))
        })
      }
      return newPaths
    }

    if (!isHumanAvailable && isElephantDone) {
      log.debug('make new paths:', path?.tail.map(printStep).join(' '))
      log.debug('Elephant done, human still going, time', path.head.human?.remaining ?? 0)
      const p = generateStep({
        head: path.head,
        tail: newTail,
        time: path.head.human?.remaining ?? 0,
        nextValve: [path.head.human.valve],
        human: { action: 'opening', valve: path.head.human.valve },
        elephant: path.head.elephant
      })
      newPaths.push(p)
      log.debug('I produced', JSON.stringify(p.head))
      return newPaths
    }

    if (isHumanDone && !isElephantDone) {
      log.debug('make new paths:', path?.tail.map(printStep).join(' '))
      log.debug('Human done, elephant still going, time', path.head.human?.remaining ?? 0)
      const p = generateStep({
        head: path.head,
        tail: newTail,
        time: path.head.elephant?.remaining ?? 0,
        nextValve: [path.head.elephant!.valve],
        elephant: { action: 'opening', valve: path.head.elephant!.valve },
        human: path.head.human
      })
      newPaths.push(p)
      log.debug('I produced', JSON.stringify(p.head))
      return newPaths
    }

    if (!isHumanAvailable && !isElephantAvailable) {
      log.info(path?.head)
      throw new Error('Shouldnt happen')
    }

    // both are in opening mode

    remainingValvesForHuman.forEach((v: string) => {
      _.reject(remainingValvesForElephant, (_v: string) => _v === v).forEach((v2: string) => {
        let humanValve = v
        let elephantValve = v2
        let humanTime = betterData[path.head.human.valve][humanValve].time + 1
        let elephantTime = betterData[path.head.elephant!.valve][elephantValve].time + 1

        let humanAction, elephantAction
        if (humanTime + path.head.time >= timeLimit) {
          humanAction = 'stay'
          humanTime = timeLimit - path.head.time
          humanValve = path.head.human.valve
        }
        if (elephantTime + path.head.time >= timeLimit) {
          elephantAction = 'stay'
          elephantTime = timeLimit - path.head.time
          elephantValve = path.head.elephant!.valve
        }

        if (elephantAction === 'stay' && humanTime <= elephantTime) {
          humanAction = 'opening'
        }
        if (humanAction === 'stay' && elephantTime <= humanTime) {
          elephantAction = 'opening'
        }

        if (elephantAction !== 'stay' && humanAction !== 'stay') {
          humanAction = humanTime <= elephantTime ? 'opening' : 'moving'
          elephantAction = elephantTime <= humanTime ? 'opening' : 'moving'
        }

        const nextValve = []
        if (humanAction === 'opening') {
          nextValve.push(humanValve)
        }
        if (elephantAction === 'opening') {
          nextValve.push(elephantValve)
        }
        let humanRemaining, elephantRemaining
        if (humanAction === 'moving') {
          humanRemaining = humanTime - elephantTime
        }
        if (elephantAction === 'moving') {
          elephantRemaining = elephantTime - humanTime
        }

        const time = Math.min(humanTime, elephantTime)

        log.debug('make new paths:', path?.tail.map(printStep).join(' '))
        log.debug(
          'Human and elephant still active, human time',
          humanTime,
          'elephant time',
          elephantTime,
          'human action',
          humanAction,
          'elephant action',
          elephantAction
        )

        const p = generateStep({
          head: path.head,
          tail: newTail,
          nextValve: nextValve,
          time: time,
          human: { action: humanAction, valve: humanValve, remaining: humanRemaining },
          elephant: { action: elephantAction, valve: elephantValve, remaining: elephantRemaining }
        })
        newPaths.push(p)
        log.debug('I produced', JSON.stringify(p.head))
        log.debug('from', JSON.stringify(p.tail[p.tail.length - 1]))
      })
    })

    if (path.head.human.action !== 'start' && path.head.elephant!.action !== 'start') {
      remainingValvesForElephant.forEach((v2: string) => {
        _.reject(remainingValvesForHuman, (_v: string) => _v === v2).forEach((v: string) => {
          let humanValve = v
          let elephantValve = v2
          let humanTime = betterData[path.head.human.valve][humanValve].time + 1
          let elephantTime = betterData[path.head.elephant!.valve][elephantValve].time + 1

          let humanAction, elephantAction
          if (humanTime + path.head.time >= timeLimit) {
            humanAction = 'stay'
            humanTime = timeLimit - path.head.time
            humanValve = path.head.human.valve
          }
          if (elephantTime + path.head.time >= timeLimit) {
            elephantAction = 'stay'
            elephantTime = timeLimit - path.head.time
            elephantValve = path.head.elephant!.valve
          }

          if (elephantAction === 'stay' && humanTime <= elephantTime) {
            humanAction = 'opening'
          }
          if (humanAction === 'stay' && elephantTime <= humanTime) {
            elephantAction = 'opening'
          }

          if (elephantAction !== 'stay' && humanAction !== 'stay') {
            humanAction = humanTime <= elephantTime ? 'opening' : 'moving'
            elephantAction = elephantTime <= humanTime ? 'opening' : 'moving'
          }

          const nextValve = []
          if (humanAction === 'opening') {
            nextValve.push(humanValve)
          }
          if (elephantAction === 'opening') {
            nextValve.push(elephantValve)
          }
          let humanRemaining, elephantRemaining
          if (humanAction === 'moving') {
            humanRemaining = humanTime - elephantTime
          }
          if (elephantAction === 'moving') {
            elephantRemaining = elephantTime - humanTime
          }

          const time = Math.min(humanTime, elephantTime)

          log.debug('make new paths:', path?.tail.map(printStep).join(' '))
          log.debug('Human and elephant still active, time', humanTime, elephantTime, time)

          const p = generateStep({
            head: path.head,
            tail: newTail,
            nextValve: nextValve,
            time: time,
            human: { action: humanAction, valve: humanValve, remaining: humanRemaining },
            elephant: { action: elephantAction, valve: elephantValve, remaining: elephantRemaining }
          })
          newPaths.push(p)
          log.debug('I produced', JSON.stringify(p.head))
        })
      })
    }
    return newPaths
  }

  const filterNonPromisingPaths = (
    newPaths: Paths,
    timeLimit: number,
    allValidValves: Array<string>,
    finished: Path | undefined
  ): Paths => {
    if (!finished) {
      return newPaths
    }
    return _.reject(newPaths, (p: Path) => {
      const remainingTime = timeLimit - p.head.time
      const remainingValves: Array<string> = _.reject(allValidValves, (v: string) => {
        if (p.head.valvesOpened.indexOf(v) >= 0) {
          return true
        }
        if (p.head.human.action === 'moving' && v === p.head.human.valve) {
          return true
        }
        if (p.head.elephant?.action === 'moving' && v === p.head.elephant?.valve) {
          return true
        }
        return false
      })
      const remainingValvesIncrease: number = _.reduce(
        remainingValves,
        (memo: number, val: string) => memo + data[val].flow,
        0
      )
      const estimatedValue =
        p.head.pressure + (p.head.pressureIncrease + remainingValvesIncrease) * remainingTime
      // console.log('finished high score is', Math.max(finished.tail[finished.tail.length - 1].pressure, finished.head.pressure))
      // console.log('estimatedValue', estimatedValue, 'pressure now',  p.head.pressure, 'rate', (p.head.pressureIncrease + remainingValvesIncrease), 'remaining time', remainingTime )

      if (
        estimatedValue < Math.max(finished.tail[finished.tail.length - 1].pressure, finished.head.pressure)
      ) {
        return true
      }
      return false
    })
  }

  const searchAlgorithm = ({
    opened,
    finished,
    timeLimit,
    allValidValves,
    betterData
  }: {
    opened: Paths
    finished: Path | undefined
    timeLimit: number
    allValidValves: Array<string>
    betterData: BetterData
  }) => {
    // removed from top
    const path: Path = opened.splice(-1)[0]
    log.debug('=== Starting ===', path.head)
    log.debug('path', path.head, 'opened', opened.length, 'finished', finished ? finished.head.pressure : '-')

    if (path.head.time === timeLimit) {
      if (!finished || path.head.pressure > finished.head.pressure) {
        log.debug('Found better pressure', path.head.pressure)
        path.tail.push(path.head)
      }
      return path
    }

    const newPaths: Paths = makeNewPaths({
      path,
      allValidValves,
      timeLimit,
      betterData
    })

    if (newPaths.length > 0) {
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

  const findCost = (betterData: BetterData, valve: string, valve2: string): Cost | undefined => {
    if (
      Object.prototype.hasOwnProperty.call(betterData, valve2) &&
      Object.prototype.hasOwnProperty.call(betterData[valve2], valve)
    ) {
      return {
        name: valve,
        valves: betterData[valve2][valve].valves.reverse(),
        time: betterData[valve2][valve].time
      }
    }

    const opened: Array<Cost> = []
    const heads: Array<Array<string>> = [[valve]]
    const flattenedHeads: Array<string> = [valve]

    while (flattenedHeads.indexOf(valve2) < 0) {
      const newHeads: Array<string> = []
      heads[heads.length - 1].forEach((valveName: string) => {
        const _newHeads: Array<string> = data[valveName].valves
        const _openedIndex: number = _.findIndex(opened, (op: Cost) => op.name === valveName)
        const _opened: Cost = _openedIndex >= 0 ? opened[_openedIndex] : { time: 0, valves: [] }

        _newHeads.forEach((valve: string) => {
          if (flattenedHeads.indexOf(valve) < 0) {
            newHeads.push(valve)
            flattenedHeads.push(valve)
            opened.push({
              name: valve,
              time: _opened.time + 1,
              valves: _opened.valves.concat(valve)
            })
          }
        })
      })
      heads.push(newHeads)
    }
    return _.find(opened, (op: Cost) => op.name === valve2)
  }

  for await (const line of lineReader) {
    const m = line.match(/^Valve (.+) has flow rate=(.+); tunnels? leads? to valves? (.+)$/)
    const name = m[1]
    const flow = parseInt(m[2])
    const valves = m[3].split(',').map((x: string) => x.trim())
    data[name] = { name, flow, valves }
  }

  log.debug('Pipe data', data)

  const allValidValves: Array<string> = Object.values(data)
    .filter((v: Valve) => v.flow > 0)
    .map((v: Valve) => v.name)
    .sort()
  allValidValves.unshift('AA')

  const betterData: any = {}
  allValidValves.forEach((valve: string) => {
    betterData[valve] = {}
    allValidValves.forEach((valve2: string) => {
      if (valve2 !== valve) {
        betterData[valve][valve2] = findCost(betterData, valve, valve2)
      }
    })
  })

  let finished: Path | undefined
  let opened: Paths
  let timeLimit: number
  let part1: number = 0
  let part2: number = 0

  if (params.part1?.skip !== true) {
    finished = undefined
    opened = [
      {
        head: {
          human: {
            valve: 'AA',
            action: 'start'
          },
          elephant: undefined,
          time: 0,
          pressure: 0,
          pressureIncrease: 0,
          withElephant: false,
          valvesOpened: ['AA']
        },
        tail: []
      }
    ]
    timeLimit = params!.part1.limit

    while (!_.isEmpty(opened)) {
      const _finished: Path | undefined = await searchAlgorithm({
        opened,
        finished,
        timeLimit,
        allValidValves,
        betterData
      })
      if (_finished) {
        finished = _finished
      }
    }

    log.info('finished', '\n' + finished?.tail.map(printStep).join('\n'))
    part1 = finished ? finished.tail[finished.tail.length - 1].pressure : 0
  }

  if (params.part2?.skip !== true) {
    finished = undefined
    opened = [
      {
        head: {
          human: {
            valve: 'AA',
            action: 'start'
          },
          elephant: {
            valve: 'AA',
            action: 'start'
          },
          time: 0,
          pressure: 0,
          pressureIncrease: 0,
          withElephant: true,
          valvesOpened: ['AA']
        },
        tail: []
      }
    ]
    timeLimit = params!.part2.limit

    let iteration: number = 0
    while (!_.isEmpty(opened)) {
      const _finished: Path | undefined = await searchAlgorithm({
        opened,
        finished,
        timeLimit,
        allValidValves,
        betterData
      })
      if (_finished) {
        finished = _finished
      }
      iteration++
      if (iteration % 100000 === 0) {
        log.info(iteration, 'opened', opened.length, 'finished', finished ? finished.head.pressure : '-')
      }
    }

    log.info('finished', '\n' + finished?.tail.map(printStep).join('\n'))
    part2 = finished?.tail[finished?.tail.length - 1].pressure ?? 0
  }

  return {
    part1,
    part2
  }
}
