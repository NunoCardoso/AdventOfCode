import { Params } from 'aoc.d'
import { intersect } from 'util/array'

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
type Path = Array<{
  human: Actor
  elephant?: Actor
}>

type Step = {
  path: Path
  time: number
  pressure: number
  pressureIncrease: number
  withElephant: boolean
  valvesVisited: Array<string>
  valvesOpened: Array<string>
}

type Data = {
  highestScore: number
  path: Step
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const valveData: ValveData = {}
  // AA does not have flow, but it is necessary for starting the network between valves with flow
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

  /*const findPath = (tunnelMap: TunnelMap, valve: string, valve2: string): Array<string> => {

    const opened: Array<Cost> = []
    const heads: Array<Array<string>> = [[valve]]
    const flattenedHeads: Array<string> = [valve]

    while (flattenedHeads.indexOf(valve2) < 0) {
      const newHeads: Array<string> = []
      heads[heads.length - 1].forEach((valveName: string) => {
        const _newHeads: Array<string> = valveData[valveName].valves
        const _openedIndex: number = opened.findIndex((op: Cost) => op.name === valveName)
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
    return opened.find((op: Cost) => op.name === valve2)
  }


  valvesWithFlow.forEach((valve: string) => {
    if (!tunnelsBetweenValvesWithFlow.has(valve)) tunnelsBetweenValvesWithFlow.set(valve, new Map())
    valvesWithFlow.forEach((valve2: string) => {
      if (valve2 !== valve) {
        let path = findPath(tunnelsBetweenValvesWithFlow, valve, valve2)!
        tunnelsBetweenValvesWithFlow.get(valve)!.set(valve2, path)
        if (!tunnelsBetweenValvesWithFlow.has(valve2)) tunnelsBetweenValvesWithFlow.set(valve2, new Map())
        tunnelsBetweenValvesWithFlow.get(valve2)!.set(valve, path)
      }
    })
  })*/

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
    s.time +
    ']'

  /* const generateStep = ({
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
          head.pressureIncrease + nextValve.reduce((memo: number, val: string) => memo + valveData[val].flow, 0),
        pressure: head.pressure + time * head.pressureIncrease,
        valvesOpened: head.valvesOpened.concat(nextValve)
      },
      tail: tail
    }
  }*/

  const makeNewSteps = (path: Array<Step>, data: Data) => {
    let head = global.structuredClone(path[path.length - 1])
    if (head.time >= data.timeLimit) return []
    const newSteps: Array<Step> = []

    if (areAllValvesWithFlowOpened(head)) {
      log.debug('All valves opened, adding one step with🧍🪑, 🐘🪑 for more time', timeLimit - path.head.time)
      const time = timeLimit - path.head.time
      const p = generateStep({
        head: path.head,
        tail: newTail,
        nextValve: [],
        time: time,
        human: { action: 'stay', valve: path.head.human.inValve },
        elephant: path.head.withElephant ? { action: 'stay', valve: path.head.elephant!.inValve } : undefined
      })
      newPaths.push(p)
      log.debug('I produced', JSON.stringify(p.head))
      return newPaths
    }

    if (!path.head.withElephant) {
      // get all unseen valves ordered by flow
      allValidValves
        .filter((v: string) => {
          if (path.head.valvesOpened.indexOf(v) >= 0) {
            return false
          }
          const time = betterData[path.head.human.inValve][v].time
          if (path.head.time + time + 1 > timeLimit) {
            return false
          }
          return true
        })
        .sort((a: string, b: string) => valveData[b].flow - valveData[a].flow)
        .forEach((nextValve: string) => {
          const time: number = betterData[path.head.human.inValve][nextValve].time + 1
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

    const remainingValves: Array<string> = allValidValves.filter((v: string) => {
      if (path.head.valvesOpened.indexOf(v) >= 0) {
        return false
      }
      if (path.head.human.action === 'moving' && v === path.head.human.inValve) {
        return false
      }
      if (path.head.elephant?.action === 'moving' && v === path.head.elephant?.inValve) {
        return false
      }
      return true
    })

    remainingValves.sort((a: string, b: string) => valveData[b].flow - valveData[a].flow)

    const isHumanAvailable: boolean =
      path.head.human.action === 'opening' || path.head.human.action === 'start'
    const isElephantAvailable: boolean =
      path.head.elephant!.action === 'opening' || path.head.elephant!.action === 'start'
    const isHumanDone: boolean = path.head.human.action === 'stay'
    const isElephantDone: boolean = path.head.elephant!.action === 'stay'

    const remainingValvesForHuman = remainingValves.filter((v: string) => {
      // console.log(path.head, v, remainingValves)
      const time = betterData[path.head.human.inValve][v].time
      return path.head.time + time + 1 <= timeLimit
    })

    const remainingValvesForElephant = remainingValves.filter((v: string) => {
      const time = betterData[path.head.elephant!.inValve][v].time
      return path.head.time + time + 1 <= timeLimit
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
        _nextValve.push(path.head.elephant!.inValve)
        elephantTime = path.head.elephant?.remaining ?? 0
      }

      if (remainingValvesForHuman.length === 0) {
        log.debug('make new paths:', path?.tail.map(printStep).join(' '))
        log.debug('only human available, and no available valves, 🧍🪑, time', elephantTime)
        const p = generateStep({
          head: path.head,
          tail: newTail,
          time: elephantTime,
          nextValve: _nextValve,
          human: { action: 'stay', valve: path.head.human.inValve },
          elephant: { action: elephantAction, valve: path.head.elephant!.inValve }
        })
        newPaths.push(p)
        log.debug('I produced', JSON.stringify(p.head))
      } else {
        remainingValvesForHuman.forEach((nextValve: string) => {
          const humanTime = betterData[path.head.human.inValve][nextValve].time + 1
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
            _nextValve.push(path.head.elephant!.inValve)
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
              valve: path.head.elephant!.inValve,
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
        _nextValve.push(path.head.human!.inValve)
        humanTime = path.head.human?.remaining ?? 0
      }

      if (remainingValvesForElephant.length === 0) {
        log.debug('make new paths:', path?.tail.map(printStep).join(' '))
        log.debug('only elephant available, and no available valves, 🐘🪑, time', humanTime)
        const p = generateStep({
          head: path.head,
          tail: newTail,
          time: humanTime,
          nextValve: _nextValve,
          human: { action: humanAction, valve: path.head.human.inValve },
          elephant: { action: 'stay', valve: path.head.elephant!.inValve }
        })
        newPaths.push(p)
        log.debug('I produced', JSON.stringify(p.head))
      } else {
        remainingValvesForElephant.forEach((nextValve: string) => {
          const elephantTime = betterData[path.head.elephant!.inValve][nextValve].time + 1
          const elephantAction = elephantTime > humanTime ? 'moving' : 'opening'
          const humanAction = humanTime > elephantTime ? 'moving' : 'opening'
          let humanRemaining: number = 0
          let elephantRemaining: number = 0
          const _nextValve = []
          if (humanAction === 'moving') {
            humanRemaining = humanTime - elephantTime
          } else {
            _nextValve.push(path.head.human.inValve)
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
            human: { action: humanAction, valve: path.head.human.inValve, remaining: humanRemaining },
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
        nextValve: [path.head.human.inValve],
        human: { action: 'opening', valve: path.head.human.inValve },
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
        nextValve: [path.head.elephant!.inValve],
        elephant: { action: 'opening', valve: path.head.elephant!.inValve },
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
      remainingValvesForElephant
        .filter((_v: string) => _v !== v)
        .forEach((v2: string) => {
          let humanValve = v
          let elephantValve = v2
          let humanTime = betterData[path.head.human.inValve][humanValve].time + 1
          let elephantTime = betterData[path.head.elephant!.inValve][elephantValve].time + 1

          let humanAction, elephantAction
          if (humanTime + path.head.time >= timeLimit) {
            humanAction = 'stay'
            humanTime = timeLimit - path.head.time
            humanValve = path.head.human.inValve
          }
          if (elephantTime + path.head.time >= timeLimit) {
            elephantAction = 'stay'
            elephantTime = timeLimit - path.head.time
            elephantValve = path.head.elephant!.inValve
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
        remainingValvesForHuman
          .filter((_v: string) => _v !== v2)
          .forEach((v: string) => {
            let humanValve = v
            let elephantValve = v2
            let humanTime = betterData[path.head.human.inValve][humanValve].time + 1
            let elephantTime = betterData[path.head.elephant!.inValve][elephantValve].time + 1

            let humanAction, elephantAction
            if (humanTime + path.head.time >= timeLimit) {
              humanAction = 'stay'
              humanTime = timeLimit - path.head.time
              humanValve = path.head.human.inValve
            }
            if (elephantTime + path.head.time >= timeLimit) {
              elephantAction = 'stay'
              elephantTime = timeLimit - path.head.time
              elephantValve = path.head.elephant!.inValve
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
    return newPaths.filter((p: Path) => {
      const remainingTime = timeLimit - p.head.time
      const remainingValves: Array<string> = allValidValves.filter((v: string) => {
        if (p.head.valvesOpened.indexOf(v) >= 0) {
          return false
        }
        if (p.head.human.action === 'moving' && v === p.head.human.inValve) {
          return false
        }
        if (p.head.elephant?.action === 'moving' && v === p.head.elephant?.inValve) {
          return false
        }
        return true
      })
      const remainingValvesIncrease: number = remainingValves.reduce(
        (memo: number, val: string) => memo + valveData[val].flow,
        0
      )
      const estimatedValue =
        p.head.pressure + (p.head.pressureIncrease + remainingValvesIncrease) * remainingTime
      // console.log('finished high score is', Math.max(finished.tail[finished.tail.length - 1].pressure, finished.head.pressure))
      // console.log('estimatedValue', estimatedValue, 'pressure now',  p.head.pressure, 'rate', (p.head.pressureIncrease + remainingValvesIncrease), 'remaining time', remainingTime )

      if (
        estimatedValue < Math.max(finished.tail[finished.tail.length - 1].pressure, finished.head.pressure)
      ) {
        return false
      }
      return true
    })
  }

  const searchAlgorithm = (opened: Array<Array<Step>>, data: Data) => {
    const path: Array<Step> = opened.splice(-1)[0]
    const head: Step = path[path.length - 1]
    log.debug('=== Starting ===', head)
    log.debug('opened', opened.length, 'highest', data.highestScore ?? '-')

    if (head.time === data.timeLimit) {
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
    let data: Data = {
      highestScore: 0,
      path: []
    }
    const opened = [
      [
        {
          human: {
            inValve: 'AA',
            action: 'start'
          },
          time: params!.limit.part1,
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

  /*if (params.part2?.skip !== true) {
    valveData = { highestScore: 0, path: []}
    opened = [
      {
        head: {
          human: {
            inValve: 'AA',
            action: 'start'
          },
          elephant: {
            inValve: 'AA',
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
    timeLimit = params!.limit.part2

    let iteration: number = 0
    while (opened.length > 0) {
      const _finished: Path | undefined = await searchAlgorithm({
        opened,
        finished,
        timeLimit,
        allValidValves: valvesWithFlow,
        betterData: tunnelsBetweenValvesWithFlow
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
    // part2 = finished?.tail[finished?.tail.length - 1].pressure ?? 0
    part2 = finished!.head.pressure
  }*/

  return { part1, part2 }
}
