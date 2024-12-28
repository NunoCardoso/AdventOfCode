import { Params } from 'aoc.d'
import clc from 'cli-color'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const directions = ['>', '<', 'v', '^']
  type Point = [number, number]
  type Grid = Array<Array<string>>
  type World = {
    grid: Grid
    moves: Array<Grid>
    rows: number
    columns: number
  }
  type Blizzard = {
    point: Point
    direction: string
  }
  type Blizzards = Array<Blizzard>
  type Step = {
    stage: number
    point: [number, number]
    move: number
    i: number
    action: string
    distance: number
  }
  type Steps = Array<Step>
  type Path = {
    head: Step
    tail: Steps
  }
  type Paths = Array<Path>

  const biggestCommonDenominator = (x: number, y: number) => {
    while (y) {
      const t = y
      y = x % y
      x = t
    }
    return x
  }

  const printWorld = ({
    world,
    opened,
    iteration,
    letter
  }: {
    world: World
    opened: Paths
    iteration: number
    letter: Record<string, string>
  }) => {
    const m: string = !_.isEmpty(opened) ? opened[0].head.move.toString() : '-'
    console.log(
      '      ' +
        _.range(0, world.columns)
          .map((i: number) => Math.floor(i / 100).toString())
          .join('')
    )
    console.log(
      'm ' +
        m.padStart(2, '0') +
        ' ' +
        _.range(0, world.columns)
          .map((i: number) => Math.floor((i % 100) / 10).toString())
          .join('')
    )
    console.log(
      'i ' +
        (iteration + 1).toString().padStart(2, '0') +
        ' ' +
        _.range(0, world.columns)
          .map((i: number) => (i % 10).toString())
          .join('')
    )

    let start = '.'
    let end = '.'

    const worldMove: Grid = _.cloneDeep(world.moves[opened[0].head.move])

    opened.forEach((path: Path) => {
      if (path.head.point[0] < 0) {
        start = clc.blue(letter.opened)
      } else if (path.head.point[0] >= worldMove.length) {
        end = clc.blue(letter.opened)
      } else {
        worldMove[path.head.point[0]][path.head.point[1]] = clc.blue(letter.opened)
      }
    })

    console.log('    ' + clc.green('#') + start + clc.green('#'.repeat(world.columns)))
    worldMove.forEach((m, i) => {
      console.log(
        ' ' +
          //  (i === path.head.point[0] ? clc.red(i.toString().padStart(2, '0')) :
          i
            .toString()
            .padStart(2, '0') +
          ' ' +
          clc.green('#') +
          m
            .map((v: string) => {
              if (directions.indexOf(v) >= 0 || v.match(/\d+/)) {
                return clc.red(v)
              }
              return v
            })
            .join('') +
          clc.green('#')
      )
    })
    console.log('    ' + clc.green('#'.repeat(world.columns)) + end + clc.green('#'))
  }

  const getDistance = (point1: Point, point2: Point): number => Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]))

  const generateMove = (i: number, templateGrid: Grid, blizzards: Blizzards): Grid => {
    const grid = _.cloneDeep(templateGrid)
    blizzards.forEach((blizzard) => {
      const newPoint: Point = [blizzard.point[0], blizzard.point[1]]
      if (blizzard.direction === 'v') {
        newPoint[0] = (newPoint[0] + i) % templateGrid.length
      }
      if (blizzard.direction === '^') {
        newPoint[0] = (newPoint[0] - (i % templateGrid.length) + templateGrid.length) % templateGrid.length
      }
      if (blizzard.direction === '<') {
        newPoint[1] = (newPoint[1] - (i % templateGrid[0].length) + templateGrid[0].length) % templateGrid[0].length
      }
      if (blizzard.direction === '>') {
        newPoint[1] = (newPoint[1] + i) % templateGrid[0].length
      }
      if (grid[newPoint[0]][newPoint[1]] === '.') {
        grid[newPoint[0]][newPoint[1]] = blizzard.direction
      } else if (directions.indexOf(grid[newPoint[0]][newPoint[1]]) >= 0) {
        grid[newPoint[0]][newPoint[1]] = '2'
      } else {
        grid[newPoint[0]][newPoint[1]] = (parseInt(grid[newPoint[0]][newPoint[1]]) + 1).toString()
      }
    })
    return grid
  }

  const printPath = (path: Path) => printStep(path.head) + '=>(' + path.tail.length + ')' + path.tail.map((_s) => '{' + printStep(_s) + '}').join('')

  const printStep = (step: Step) => '#' + step.move + '[' + step.point[0] + ',' + step.point[1] + ']' + step.action

  const makeNewPaths = ({ paths, world }: { paths: Paths; world: World }): Paths => {
    const newPaths: Paths = []
    paths.forEach((path: Path) => {
      const newTail: Steps = path.tail.concat(path.head)
      const newI: number = path.head.i + 1
      const newMove: number = newI % world.moves.length
      const goal = path.head.stage % 2 === 1 ? end : start

      log.trace(
        'newPaths before',
        newPaths.map((x: Path) => printPath(x))
      )
      let _newPaths: Paths = [
        {
          head: {
            stage: path.head.stage,
            point: [path.head.point[0] - 1, path.head.point[1]],
            action: '<',
            move: newMove,
            i: newI,
            distance: getDistance([path.head.point[0] - 1, path.head.point[1]], goal)
          },
          tail: newTail
        },
        {
          head: {
            stage: path.head.stage,
            point: [path.head.point[0] + 1, path.head.point[1]],
            action: '>',
            move: newMove,
            i: newI,
            distance: getDistance([path.head.point[0] + 1, path.head.point[1]], goal)
          },
          tail: newTail
        },
        {
          head: {
            stage: path.head.stage,
            point: [path.head.point[0], path.head.point[1] + 1],
            action: 'v',
            move: newMove,
            i: newI,
            distance: getDistance([path.head.point[0], path.head.point[1] + 1], goal)
          },
          tail: newTail
        },
        {
          head: {
            stage: path.head.stage,
            point: [path.head.point[0], path.head.point[1] - 1],
            action: '^',
            move: newMove,
            i: newI,
            distance: getDistance([path.head.point[0], path.head.point[1] - 1], goal)
          },
          tail: newTail
        },
        {
          head: {
            stage: path.head.stage,
            point: [path.head.point[0], path.head.point[1]],
            action: '*',
            move: newMove,
            i: newI,
            distance: path.head.distance
          },
          tail: newTail
        }
      ]

      _newPaths = _.reject(_newPaths, (newPath: Path) => {
        if (matchesPoint(newPath.head.point, end) || matchesPoint(newPath.head.point, start)) {
          return false
        }
        if (newPath.head.point[0] < 0 || newPath.head.point[1] < 0 || newPath.head.point[0] >= world.rows || newPath.head.point[1] >= world.columns) {
          log.trace('rejecting new path', printPath(newPath), 'out of bounds')
          return true
        }
        const worldMove = world.moves[newMove]
        if (worldMove[newPath.head.point[0]][newPath.head.point[1]] !== '.') {
          log.trace('rejecting new path', printPath(newPath), 'on moves #', newMove, 'value is', worldMove[newPath.head.point[0]][newPath.head.point[1]])
          return true
        }

        const alreadyExists = _.findIndex(newPaths, (_p: Path) => matchesHead(_p, newPath))
        if (alreadyExists >= 0) {
          if (newPath.tail.length < newPaths[alreadyExists].tail.length) {
            log.trace('new step', printPath(newPath), 'on moves #', newMove, 'has a shorter tail, replacing')
            newPaths[alreadyExists] = newPath
          } else {
            log.trace('rejecting new step', printPath(newPath), 'on moves #', newMove, 'already on list')
          }
          return true
        }
        return false
      })

      newPaths.push(..._newPaths)
      log.trace(
        'generated _newPaths',
        _newPaths.map((x: Path) => printPath(x))
      )
      log.trace(
        'newPaths for ',
        printPath(path),
        'is now',
        newPaths.map((x: Path) => printPath(x))
      )
    })
    return newPaths
  }

  const matchesHead = (p1: Path, p2: Path) => matchesPoint(p1.head.point, p2.head.point)

  const matchesPoint = (p1: Point, p2: Point) => p1[0] === p2[0] && p1[1] === p2[1]

  const searchAlgorithm = async ({
    opened,
    finished,
    world,
    end,
    iteration,
    endStage
  }: {
    opened: Paths
    finished: Paths
    world: World
    end: Point
    iteration: number
    endStage: number
  }) => {
    log.debug('=== Starting === best finished', finished.length > 0 ? finished[0].tail.length : '-')
    log.debug(finished.length > 0 ? printPath(finished[0]) : '-')

    for (let i = 0; i < opened.length; i++) {
      if (matchesPoint(opened[i].head.point, end) && opened[i].head.stage % 2 === 1) {
        if (opened[i].head.stage === endStage) {
          if (_.isEmpty(finished) || opened[i].tail.length < finished[0].tail.length) {
            log.debug('Found better path with length', opened[i].tail.length, printPath(opened[i]))
            finished.unshift(opened[i])
          }
        } else {
          log.info('Stage', opened[i].head.stage, 'complete')
          log.info('Trimming and switching')
          const thepath = _.cloneDeep(opened[i])
          thepath.head.stage++
          opened.splice(0, opened.length)
          opened.push(thepath)
          log.info('opened is now', opened.length)
        }
      }
      if (matchesPoint(opened[i].head.point, start) && opened[i].head.stage % 2 === 0) {
        log.info('Stage', opened[i].head.stage, 'complete')
        log.info('Trimming and switching')
        const thepath = _.cloneDeep(opened[i])
        thepath.head.stage++
        opened.splice(0, opened.length)
        opened.push(thepath)
        log.info('opened is now', opened.length)
      }
    }

    const newOpenedStart = makeNewPaths({ paths: opened, world })

    // Writing to the same object
    opened.splice(0, opened.length)
    opened.push(...newOpenedStart)

    // sort and prune
    opened.sort((a: Path, b: Path) => a.head.distance - b.head.distance).splice(20, 100)

    log.trace(opened)
    if (params.ui?.show && params.ui?.during) {
      printWorld({
        world,
        opened: opened,
        iteration,
        letter: { path: 'S', opened: 'O', new: '@' }
      })
      await new Promise((resolve) => setTimeout(resolve, params.ui?.wait ?? 1000))
    }
  }

  const world: World = { grid: [], rows: 0, columns: 0, moves: [] }
  const blizzards: Blizzards = []
  let linenumber = 0
  const start: Point = [-1, 0]
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    if (line.startsWith('#.#')) {
      world.columns = line.length - 2
    } else if (line.endsWith('#.#')) {
      world.rows = linenumber - 1
    } else {
      const vals = line.split('')
      vals.forEach((char: string, i: number) => {
        if (char !== '#' && char !== '.') {
          blizzards.push({
            point: [linenumber - 1, i - 1],
            direction: char
          })
        }
      })
    }
    linenumber++
  }
  const end: Point = [world.rows, world.columns - 1]

  const templateGrid: Grid = []
  for (let i = 0; i < world.rows; i++) {
    templateGrid.push('.'.repeat(world.columns).split(''))
  }
  const numberOfDifferentMoves = (world.columns * world.rows) / biggestCommonDenominator(world.rows, world.columns)
  log.debug('World with', world.columns, 'columns', world.rows, 'rows, generating', numberOfDifferentMoves, 'moves')
  for (let i = 0; i < numberOfDifferentMoves; i++) {
    const move: Grid = generateMove(i, templateGrid, blizzards)
    world.moves.push(move)
  }
  log.debug('Done creating moves')

  let finished: Paths = []
  let opened: Paths = [
    {
      head: {
        stage: 1,
        point: start,
        i: 0,
        move: 0,
        distance: getDistance(start, end),
        action: ''
      },
      tail: []
    }
  ]

  let iteration: number = 0
  while (_.isEmpty(finished)) {
    await searchAlgorithm({
      opened: opened,
      finished,
      world,
      end,
      iteration,
      endStage: 1
    })
    iteration++

    if (iteration % 10 === 0) {
      log.debug(iteration, 'opened', opened.length, 'finished', finished.length > 0 ? finished[0].tail.length : '-')
    }
  }
  // log.info(printPath(finished[0]))
  part1 = finished[0].tail.length
  if (params.ui?.show && params.ui?.end) {
    printWorld({
      world,
      opened: opened,
      iteration,
      letter: { path: 'S', opened: 'O', new: '@' }
    })
  }

  finished = []
  opened = [
    {
      head: {
        stage: 1,
        point: start,
        i: 0,
        move: 0,
        distance: getDistance(start, end),
        action: ''
      },
      tail: []
    }
  ]

  iteration = 0
  while (_.isEmpty(finished)) {
    await searchAlgorithm({
      opened: opened,
      finished,
      world,
      end,
      iteration,
      endStage: 3
    })
    iteration++

    if (iteration % 10 === 0) {
      log.debug(iteration, 'opened', opened.length, 'finished', finished.length > 0 ? finished[0].tail.length : '-')
    }
  }
  if (params.ui?.show && params.ui?.end) {
    printWorld({
      world,
      opened: opened,
      iteration,
      letter: { path: 'S', opened: 'O', new: '@' }
    })
  }
  part2 = finished[0].tail.length

  return { part1, part2 }
}
