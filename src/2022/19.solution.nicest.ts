import _ from 'lodash'
import { Params } from 'aoc'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Blueprint = {
    id: number
    oreRobot: { ore: number }
    clayRobot: { ore: number }
    obsidianRobot: { ore: number; clay: number }
    geodeRobot: { ore: number; obsidian: number }
  }

  type Resources = {
    ore: number
    clay: number
    obsidian: number
    geode: number
  }

  type Robots = Resources

  type Step = {
    resources: Resources
    robots: Robots
    time: number
  }

  type Path = Array<Step>

  type Finished = {
    path: Path
    geodes: number
  }

  const blueprints: Array<Blueprint> = []

  const haveResourcesForGeodeRobot = (blueprint: Blueprint, head: Step) =>
    head.resources.obsidian >= blueprint.geodeRobot.obsidian && head.resources.ore >= blueprint.geodeRobot.ore

  const haveResourcesForObsidianRobot = (blueprint: Blueprint, head: Step) =>
    head.resources.clay >= blueprint.obsidianRobot.clay && head.resources.ore >= blueprint.obsidianRobot.ore

  const haveResourcesForClayRobot = (blueprint: Blueprint, head: Step) =>
    head.resources.ore >= blueprint.clayRobot.ore

  const haveResourcesForOreRobot = (blueprint: Blueprint, head: Step) =>
    head.resources.ore >= blueprint.oreRobot.ore

  const timeToMakeAGeodeRobot = (blueprint: Blueprint, step: Step): number =>
    1 +
    (haveResourcesForGeodeRobot(blueprint, step)
      ? 0
      : Math.max(
        Math.ceil(
          (blueprint.geodeRobot.obsidian - step.resources.obsidian) / Math.max(step.robots.obsidian, 1)
        ),
        Math.ceil((blueprint.geodeRobot.ore - step.resources.ore) / Math.max(step.robots.ore, 1))
      ))

  const timeToMakeAnObsidianRobot = (blueprint: Blueprint, step: Step): number =>
    1 +
    (haveResourcesForObsidianRobot(blueprint, step)
      ? 0
      : Math.max(
        Math.ceil((blueprint.obsidianRobot.clay - step.resources.clay) / Math.max(step.robots.clay, 1)),
        Math.ceil((blueprint.obsidianRobot.ore - step.resources.ore) / Math.max(step.robots.ore, 1))
      ))

  const timeToMakeAClayRobot = (blueprint: Blueprint, step: Step): number =>
    1 +
    (haveResourcesForClayRobot(blueprint, step)
      ? 0
      : Math.max(Math.ceil((blueprint.clayRobot.ore - step.resources.ore) / step.robots.ore)))

  const timeToMakeAnOreRobot = (blueprint: Blueprint, step: Step): number =>
    1 +
    (haveResourcesForOreRobot(blueprint, step)
      ? 0
      : Math.max(Math.ceil((blueprint.oreRobot.ore - step.resources.ore) / step.robots.ore)))

  const canBuildGeodeRobot = (blueprint: Blueprint, head: Step) => head.robots.obsidian > 0

  const canBuildObsidianRobot = (blueprint: Blueprint, head: Step) => head.robots.clay > 0

  const printStep = (s: Step) =>
    '[' +
    s.robots.ore.toString() +
    ',' +
    s.robots.clay.toString() +
    ',' +
    s.robots.obsidian.toString() +
    ',' +
    s.robots.geode.toString() +
    '](' +
    s.time +
    ')'

  const printPath = (path: Path) => path.map(printStep).join(',')

  const getThemGeodes = ({
    path,
    finished,
    blueprint,
    maxMinutes
  }: {
    path: Path
    finished: Finished
    blueprint: Blueprint
    maxMinutes: number
  }) => {
    // I should have max robots that allow me to build any robot in 1 min.
    const maxRobots: Robots = {
      geode: 100,
      obsidian: blueprint.geodeRobot.obsidian,
      ore: Math.max(
        blueprint.geodeRobot.ore,
        blueprint.obsidianRobot.ore,
        blueprint.clayRobot.ore,
        blueprint.oreRobot.ore
      ),
      clay: blueprint.obsidianRobot.clay
    }

    // log.debug('=== Starting ===', printPath(path))
    // log.debug('opened', path.length, 'finished', finished?.geodes)
    const searchAlgorithm = ({
      path,
      finished,
      blueprint,
      maxMinutes
    }: {
      path: Path
      finished: Finished
      blueprint: Blueprint
      maxMinutes: number
    }) => {
      const head = _.cloneDeep(path[path.length - 1])
      if (head.time >= maxMinutes) {
        return
      }

      if (finished.geodes < head.resources.geode) {
        log.info('Better finish', head.resources.geode, printPath(path))
        finished.path = path
        finished.geodes = head.resources.geode
      }

      if (canBuildGeodeRobot(blueprint, head)) {
        log.trace('I can build geode robot')
        const newStep = _.cloneDeep(head)
        const time: number = timeToMakeAGeodeRobot(blueprint, newStep)

        newStep.resources.obsidian += newStep.robots.obsidian * time
        newStep.resources.clay += newStep.robots.clay * time
        newStep.resources.ore += newStep.robots.ore * time
        newStep.time += time
        newStep.resources.geode += maxMinutes - newStep.time

        newStep.robots.geode += 1
        newStep.resources.ore -= blueprint.geodeRobot.ore
        newStep.resources.obsidian -= blueprint.geodeRobot.obsidian

        searchAlgorithm({
          path: path.concat(newStep),
          finished,
          blueprint,
          maxMinutes
        })
      }

      if (canBuildObsidianRobot(blueprint, head)) {
        log.trace('can build obsidian robot')
        const newStep = _.cloneDeep(head)
        const time: number = timeToMakeAnObsidianRobot(blueprint, newStep)
        // we can still build an obsidian robot in max - 2, a geode in max -1, and have one last geode, hence the -2
        if (newStep.time + time < maxMinutes - 2) {
          newStep.time += time
          newStep.resources.obsidian += newStep.robots.obsidian * time
          newStep.resources.clay += newStep.robots.clay * time
          newStep.resources.ore += newStep.robots.ore * time

          newStep.robots.obsidian += 1
          newStep.resources.ore -= blueprint.obsidianRobot.ore
          newStep.resources.clay -= blueprint.obsidianRobot.clay
          searchAlgorithm({
            path: path.concat(newStep),
            finished,
            blueprint,
            maxMinutes
          })
        }
      }

      if (head.robots.clay <= maxRobots.clay) {
        log.trace('can build clay robot')
        const newStep = _.cloneDeep(head)
        const time: number = timeToMakeAClayRobot(blueprint, newStep)
        if (newStep.time + time < maxMinutes - 5) {
          newStep.time += time
          newStep.resources.obsidian += newStep.robots.obsidian * time
          newStep.resources.clay += newStep.robots.clay * time
          newStep.resources.ore += newStep.robots.ore * time

          newStep.robots.clay += 1
          newStep.resources.ore -= blueprint.clayRobot.ore
          searchAlgorithm({
            path: path.concat(newStep),
            finished,
            blueprint,
            maxMinutes
          })
        }
      }

      if (head.robots.ore <= maxRobots.ore) {
        log.trace('can build ore robot')
        const newStep = _.cloneDeep(head)
        const time: number = timeToMakeAnOreRobot(blueprint, newStep)
        if (newStep.time + time < maxMinutes - 5) {
          newStep.time += time
          newStep.resources.obsidian += newStep.robots.obsidian * time
          newStep.resources.clay += newStep.robots.clay * time
          newStep.resources.ore += newStep.robots.ore * time

          newStep.robots.ore += 1
          newStep.resources.ore -= blueprint.oreRobot.ore
          searchAlgorithm({
            path: path.concat(newStep),
            finished,
            blueprint,
            maxMinutes
          })
        }
      }
    }

    searchAlgorithm({ path, finished, blueprint, maxMinutes })
    return finished
  }

  for await (const line of lineReader) {
    const m = line.match(
      /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
    )
    if (m) {
      const blueprint: Blueprint = {
        id: parseInt(m[1]),
        oreRobot: { ore: parseInt(m[2]) },
        clayRobot: { ore: parseInt(m[3]) },
        obsidianRobot: { ore: parseInt(m[4]), clay: parseInt(m[5]) },
        geodeRobot: { ore: parseInt(m[6]), obsidian: parseInt(m[7]) }
      }
      blueprints.push(blueprint)
    }
  }

  let part1: number = 0
  let part2: number = 1
  let finished: Finished
  const initialPath: Path = [
    {
      resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      time: 0
    }
  ]

  if (params.part1?.skip !== true) {
    blueprints.forEach((blueprint) => {
      finished = getThemGeodes({
        maxMinutes: params.part1.limit,
        blueprint,
        path: _.cloneDeep(initialPath),
        finished: {
          path: [],
          geodes: 0
        }
      })
      log.warn('Blueprint', blueprint.id, 'path', printPath(finished.path), 'geodes', finished.geodes)
      part1 += blueprint.id * finished.geodes
    })
  }

  if (params.part2?.skip !== true) {
    blueprints.slice(0, 3).forEach((blueprint) => {
      finished = getThemGeodes({
        maxMinutes: params.limit.part2,
        blueprint,
        path: _.cloneDeep(initialPath),
        finished: {
          path: [],
          geodes: 0
        }
      })
      log.warn('Blueprint', blueprint.id, 'path', printPath(finished.path), 'geodes', finished.geodes)
      part2 *= blueprint.id * finished.geodes
    })
  }

  return { part1, part2 }
}
