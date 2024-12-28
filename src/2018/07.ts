import { Params } from 'aoc.d'
import { Combination } from 'js-combinatorics'

type WorkerTask = { time: number; task: string } | null
type Workers = Record<string, WorkerTask>
type Step = {
  time: number
  workers: Workers
  doneTasks: string[]
  backlogTasks: string[]
  action: string
}

type Path = Step[]

type Data = {
  path?: Path
  end: number
  workers: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: number | undefined = 0

  let letterIndex = '_ABCDEFGHIJKLMNOPQRSTUVWXYZ' // underscore to add +1 on index
  const taskXisFollowedByTaskY: Record<string, string[]> = {}
  const taskXisPrecededByTaskY: Record<string, string[]> = {}

  let taskList: string[] = []

  for await (const line of lineReader) {
    const [, source, target] = line.match(/Step (.+) must be finished before step (.+) can begin./)
    if (!taskXisFollowedByTaskY[source]) taskXisFollowedByTaskY[source] = [target]
    else taskXisFollowedByTaskY[source].push(target)
    if (!taskXisPrecededByTaskY[target]) taskXisPrecededByTaskY[target] = [source]
    else taskXisPrecededByTaskY[target].push(source)
    if (!taskList.includes(source)) taskList.push(source)
    if (!taskList.includes(target)) taskList.push(target)
  }

  const firstTask = taskList.find((task) => !taskXisPrecededByTaskY[task])!

  const solvePart1 = () => {
    // the first task has no preceding tasks
    const doneTasks = [firstTask]
    let pendingTasks = taskXisFollowedByTaskY[firstTask]

    while (pendingTasks.length > 0) {
      // get more pending tasks that have all preceding tasks done
      // I only need the first one (as they are already in alphabetical order)
      let doableTask = pendingTasks.find((t) =>
        taskXisPrecededByTaskY[t].every((dependentT) => doneTasks.includes(dependentT))
      )

      if (doableTask) {
        // take it off from pending tasks, put it to done
        pendingTasks = pendingTasks.filter((t) => t !== doableTask)
        doneTasks.push(doableTask)
        // get more pending tasks (if not there)
        taskXisFollowedByTaskY[doableTask]?.forEach((newTask) => {
          if (!pendingTasks.includes(newTask)) pendingTasks.push(newTask)
        })
        pendingTasks.sort((a, b) => a.localeCompare(b))
      }
    }
    return doneTasks.join('')
  }

  const timeToDoTask = (task: string) => params.costPerStep + letterIndex.indexOf(task)

  const printPath = (path: Path): string =>
    '\nTime: ' +
    path[path.length - 1].time +
    's' +
    '\nDone: [' +
    path[path.length - 1].doneTasks.join('') +
    '] ' +
    '\nBacklog: ' +
    path[path.length - 1].backlogTasks.join('') +
    ' ' +
    '\nworkers: ' +
    JSON.stringify(path[path.length - 1].workers) +
    ' ' +
    '\nAction: ' +
    path[path.length - 1].action +
    ' '

  const getDoableTasks = (recentlyDoneTasks: string[], doneTasks: string[], backlogTasks: string[]): string[] => {
    let doableTasks: string[] = [...backlogTasks]

    // next doable tasks is all following tasks that have preceding tasks all done
    recentlyDoneTasks?.forEach((recentlyDoneTask) => {
      taskXisFollowedByTaskY[recentlyDoneTask]
        ?.filter((t) => taskXisPrecededByTaskY[t].every((precedingTasks) => doneTasks.includes(precedingTasks)))
        .forEach((t) => {
          if (!doableTasks.includes(t)) doableTasks.push(t)
        })
    })
    //log.debug('get doable tasks for ', doableTasks)
    return doableTasks
  }

  const getNewPaths = (path: Path): Path[] => {
    let currentStep: Step = path[path.length - 1]
    let nextStep = { ...currentStep }

    let nextTime: number | undefined = undefined // next time event
    let nextIdleWorkers: string[] = [] // idle workers at next time event
    let nextDoneTasks: string[] = [] // done tasks at next time event

    // get the next time event where a worker (or workers) will become idle
    // get also the status of workers and done tasks at that time event
    Object.keys(currentStep.workers).forEach((key) => {
      if (currentStep.workers[key] !== null) {
        if (nextTime === undefined || currentStep.workers[key]!.time < nextTime) {
          nextTime = currentStep.workers[key]!.time
          nextDoneTasks = [currentStep.workers[key]!.task]
          nextIdleWorkers = [key]
        } else if (currentStep.workers[key]!.time === nextTime) {
          nextIdleWorkers.push(key)
          nextDoneTasks.push(currentStep.workers[key]!.task)
        }
      }
    })

    Object.keys(currentStep.workers).forEach((key) => {
      if (currentStep.workers[key] === null) {
        // let's join in the workers that were already idle
        nextIdleWorkers.push(key)
      }
    })

    // let's forward time to the next event
    nextStep.time = nextTime!
    nextStep.doneTasks = nextStep.doneTasks.concat(nextDoneTasks) // add done tasks
    nextIdleWorkers.forEach((worker) => (nextStep.workers[worker] = null)) // add idle workers

    // so, let's find more doable tasks for all idling workers (pass the current backlog as well)
    let doableTasks = getDoableTasks(nextDoneTasks, nextStep.doneTasks, nextStep.backlogTasks)
    nextStep.action =
      'Time advanced to ' +
      nextTime +
      's, doable tasks: [' +
      doableTasks.join('') +
      '] Workers idle: ' +
      nextIdleWorkers.join(', ')

    // no more tasks to do for now, maybe wait for another task to be finished
    if (doableTasks.length === 0)
      return [
        [
          ...path,
          {
            ...nextStep,
            action: nextStep.action + ', no doable tasks to do',
            backlogTasks: doableTasks
          }
        ]
      ]

    // if there are doable tasks, let's assign them to idle workers
    let combinations: string[][]

    // if less doable tasks than workers, just push all tasks.
    if (doableTasks.length <= nextIdleWorkers.length) {
      combinations = [doableTasks.slice(0, nextIdleWorkers.length)]
    } else {
      // make combinations if there are more tasks than workers
      combinations = new Combination(doableTasks.join(''), nextIdleWorkers.length).toArray()
    }
    // console.log('\ncombinations', combinations, 'idle workers', nextIdleWorkers)
    return combinations.map((combination) => {
      let newWorkers: Workers = {}
      let assignedTasks: string[] = []
      // assign idle workers to doable tasks. We may get more idle workers than tasks, so we slice the combination
      nextIdleWorkers.slice(0, combination.length).forEach((worker, index) => {
        newWorkers[worker] = {
          task: combination[index],
          time: nextStep.time + timeToDoTask(combination[index])
        }
        assignedTasks.push(combination[index])
      })

      // backlog tasks is initial doable tasks minus assigned tasks
      let newBacklogTasks = doableTasks.filter((task) => !assignedTasks.includes(task))

      return [
        ...path,
        {
          ...nextStep,
          backlogTasks: newBacklogTasks,
          //action: nextHead.action + 'New backlog ' + newBacklogTasks.join('') + '\nNew tasks ' + JSON.stringify(newWorkerAndTask) + '\nNew times ' + JSON.stringify(newWorkerAndNextTime),
          workers: { ...nextStep.workers, ...newWorkers }
        }
      ]
    })
  }

  const doDijkstra = (opened: Path[], data: Data) => {
    const path: Path = opened.splice(-1)[0]

    log.debug(
      '=== Dijkstra === opened',
      opened.length,
      'current low',
      data.path ? data.path[data.path?.length - 1].time : '-',
      printPath(path)
    )

    if (path[path.length - 1].doneTasks.length === data.end) {
      if (
        !data.path ||
        (typeof data.path[data.path.length - 1]?.time === 'number' &&
          path[path.length - 1].time < data.path[data.path.length - 1]?.time)
      ) {
        log.info('got lowest', path[path.length - 1].time, printPath(path))
        data.path = path
      }
      return
    }

    getNewPaths(path)?.forEach((newPath) => opened.push(newPath))
  }

  const solvePart2 = () => {
    const data: Data = {
      path: undefined,
      end: taskList.length,
      workers: params.workers
    }

    let workers: Workers = {}
    new Array(params.workers).fill(null).forEach((_, index) => (workers[index.toString()] = null))
    workers['0'] = { task: firstTask, time: timeToDoTask(firstTask) }

    let openedPaths: Path[] = [
      [
        {
          time: 0,
          doneTasks: [],
          backlogTasks: [],
          workers,
          action: 'Worker 0 assigned task ' + firstTask + ' will finish in ' + timeToDoTask(firstTask) + 's'
        }
      ]
    ]

    let iterations = 0
    while (openedPaths.length > 0) {
      doDijkstra(openedPaths, data)
      if (iterations % 100 === 0) {
        log.info('it', iterations, 'opened', openedPaths.length)
        iterations++
      }
    }
    log.info('Got lowest', data.path![data.path!.length - 1]?.time, printPath(data.path!))
    return data.path![data.path!.length - 1]?.time
  }

  if (!params.skipPart1) {
    part1 = solvePart1()
  }

  if (!params.skipPart2) {
    part2 = solvePart2()
  }

  return { part1, part2 }
}
