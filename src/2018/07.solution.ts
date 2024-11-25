import { Params } from 'aoc.d'

type Step = {
  time: string
  worker: number
  task: string
}

type Path = {
  time: number
  workers: Worker[]
  path: Step[]
}

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

  const printPath = (path: Path): string => path.tasks + '(' + path.score + ')'

  const getNewPaths = (path: Path): Path[] => {
    let lastTask = path.tasks[path.tasks.length - 1]
    log.debug('last task', lastTask)
    log.debug('taskXisFollowedByTaskY[lastTask]', taskXisFollowedByTaskY[lastTask])
    // next doable tasks is all following tasks that have preceding tasks all done
    let paths = taskXisFollowedByTaskY[lastTask]
      .filter((t) => taskXisPrecededByTaskY[t].every((dependentT) => path.tasks.includes(dependentT)))
      ?.map((t) => ({
        tasks: path.tasks.concat(t),
        score: params.costPerStep + letterIndex.indexOf(t)
      }))
    return paths
  }

  const doDijkstra = (opened: Path[], data: Data) => {
    const path: Path = opened.splice(-1)[0]

    log.debug('=== Dijkstra ===', printPath(path), 'opened', opened.length, 'current low', data.path?.score)

    if (path.tasks.length === data.end) {
      if (!data.path || (typeof data.path?.score === 'number' && path.score < data.path?.score)) {
        log.debug('got lowest', printPath(path))
        data.path = path
      }
      return
    }

    const newPaths: Path[] = getNewPaths(path)
    if (newPaths.length !== 0) {
      newPaths.forEach((newPath) => {
        opened.push(newPath)
      })
      // pendingTasks.sort((a, b) => b[2] - a[2])
    }
  }

  const solvePart2 = () => {
    const data: Data = {
      path: undefined,
      end: taskList.length,
      workers: params.workers
    }

    let openedPaths: Path[] = [
      {
        score: params.costPerStep + letterIndex.indexOf(firstTask),
        tasks: [firstTask]
      }
    ]

    let iterations = 0
    while (openedPaths.length > 0) {
      doDijkstra(openedPaths, data)
      //if (iterations % 100 === 0) {
      log.debug('it', iterations, 'opened', openedPaths.length)
      iterations++
      //}
    }
    return data.path?.score
  }

  if (!params.skipPart1) {
    part1 = solvePart1()
  }

  if (!params.skipPart2) {
    part2 = solvePart2()
  }

  return { part1, part2 }
}
