import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Blueprint = {
    id: number
    oreRobot: { ore: number }
    clayRobot: { ore: number }
    obsidianRobot: { ore: number; clay: number }
    geodeRobot: { ore: number; obsidian: number }
  }

  type Resources = { ore: number; clay: number; obsidian: number; geode: number }
  type Robots = Resources

  const blueprints: Array<Blueprint> = []

  const haveResourcesForGeodeRobot = (blueprint: Blueprint, obsidian: number, ore: number) =>
    obsidian >= blueprint.geodeRobot.obsidian && ore >= blueprint.geodeRobot.ore

  const haveResourcesForObsidianRobot = (blueprint: Blueprint, clay: number, ore: number) =>
    clay >= blueprint.obsidianRobot.clay && ore >= blueprint.obsidianRobot.ore

  const haveResourcesForClayRobot = (blueprint: Blueprint, ore: number) => ore >= blueprint.clayRobot.ore

  const haveResourcesForOreRobot = (blueprint: Blueprint, ore: number) => ore >= blueprint.oreRobot.ore

  const timeToMakeAGeodeRobot = (
    blueprint: Blueprint,
    obsidian: number,
    ore: number,
    obsidianRobot: number,
    oreRobot: number
  ): number =>
    1 +
    (haveResourcesForGeodeRobot(blueprint, obsidian, ore)
      ? 0
      : Math.max(
          Math.ceil((blueprint.geodeRobot.obsidian - obsidian) / obsidianRobot),
          Math.ceil((blueprint.geodeRobot.ore - ore) / oreRobot)
        ))

  const timeToMakeAnObsidianRobot = (
    blueprint: Blueprint,
    clay: number,
    ore: number,
    clayRobot: number,
    oreRobot: number
  ): number =>
    1 +
    (haveResourcesForObsidianRobot(blueprint, clay, ore)
      ? 0
      : Math.max(
          Math.ceil((blueprint.obsidianRobot.clay - clay) / clayRobot),
          Math.ceil((blueprint.obsidianRobot.ore - ore) / oreRobot)
        ))

  const timeToMakeAClayRobot = (blueprint: Blueprint, ore: number, oreRobot: number): number =>
    1 + (haveResourcesForClayRobot(blueprint, ore) ? 0 : Math.ceil((blueprint.clayRobot.ore - ore) / oreRobot))

  const timeToMakeAnOreRobot = (blueprint: Blueprint, ore: number, oreRobot: number): number =>
    1 + (haveResourcesForOreRobot(blueprint, ore) ? 0 : Math.ceil((blueprint.oreRobot.ore - ore) / oreRobot))

  const canBuildGeodeRobot = (blueprint: Blueprint, obsidianRobot: number) => obsidianRobot > 0

  const canBuildObsidianRobot = (blueprint: Blueprint, clayRobot: number) => clayRobot > 0

  const getThemGeodes = (
    blueprint: Blueprint,
    resources: Resources,
    robots: Robots,
    time: number,
    maxMinutes: number
  ) => {
    // I should have max robots that allow me to build any robot in 1 min.
    const maxRobots: Robots = {
      ore: Math.max(
        blueprint.geodeRobot.ore,
        blueprint.obsidianRobot.ore,
        blueprint.clayRobot.ore,
        blueprint.oreRobot.ore
      ),
      clay: blueprint.obsidianRobot.clay,
      obsidian: blueprint.geodeRobot.obsidian,
      geode: 100
    }
    let geodeHighScore: number = 0

    const searchAlgorithm = (
      blueprint: Blueprint,
      resources: Resources,
      robots: Robots,
      time: number,
      maxMinutes: number
    ) => {
      if (time >= maxMinutes) {
        return
      }

      if (geodeHighScore < resources.geode && resources.ore >= 0) {
        log.debug('Better finish', resources.geode)
        geodeHighScore = resources.geode
      }

      if (canBuildGeodeRobot(blueprint, robots.obsidian)) {
        log.trace('I can build geode robot')
        const newTime: number = timeToMakeAGeodeRobot(
          blueprint,
          resources.obsidian,
          resources.ore,
          robots.obsidian,
          robots.ore
        )
        searchAlgorithm(
          blueprint,
          {
            ore: resources.ore - blueprint.geodeRobot.ore + robots.ore * newTime,
            clay: resources.clay + robots.clay * newTime,
            obsidian: resources.obsidian - blueprint.geodeRobot.obsidian + robots.obsidian * newTime,
            geode: resources.geode + maxMinutes - (time + newTime)
          },
          {
            ...robots,
            geode: robots.geode + 1
          },
          time + newTime,
          maxMinutes
        )
        // if I am making geode robots in one minute, then don't do anything else
        if (newTime === 1) {
          return
        }
      }

      if (canBuildObsidianRobot(blueprint, robots.clay)) {
        log.trace('can build obsidian robot')
        const newTime: number = timeToMakeAnObsidianRobot(
          blueprint,
          resources.clay,
          resources.ore,
          robots.clay,
          robots.ore
        )
        // we can still build an obsidian robot in max - 2, a geode in max -1, and have one last geode, hence the -2
        if (maxMinutes - (time + newTime) > 2) {
          searchAlgorithm(
            blueprint,
            {
              ore: resources.ore - blueprint.obsidianRobot.ore + robots.ore * newTime,
              clay: resources.clay - blueprint.obsidianRobot.clay + robots.clay * newTime,
              obsidian: resources.obsidian + robots.obsidian * newTime,
              geode: resources.geode
            },
            {
              ...robots,
              obsidian: robots.obsidian + 1
            },
            time + newTime,
            maxMinutes
          )
        }
      }

      if (robots.clay <= maxRobots.clay) {
        const newTime: number = timeToMakeAClayRobot(blueprint, resources.ore, robots.ore)
        if (maxMinutes - (time + newTime) > 3) {
          searchAlgorithm(
            blueprint,
            {
              ore: resources.ore - blueprint.clayRobot.ore + robots.ore * newTime,
              clay: resources.clay + robots.clay * newTime,
              obsidian: resources.obsidian + robots.obsidian * newTime,
              geode: resources.geode
            },
            {
              ...robots,
              clay: robots.clay + 1
            },
            time + newTime,
            maxMinutes
          )
        }
      }

      if (robots.ore <= maxRobots.ore) {
        const newTime: number = timeToMakeAnOreRobot(blueprint, resources.ore, robots.ore)
        if (maxMinutes - (time + newTime) > 4) {
          searchAlgorithm(
            blueprint,
            {
              ore: resources.ore - blueprint.oreRobot.ore + robots.ore * newTime,
              clay: resources.clay + robots.clay * newTime,
              obsidian: resources.obsidian + robots.obsidian * newTime,
              geode: resources.geode
            },
            {
              ...robots,
              ore: robots.ore + 1
            },
            time + newTime,
            maxMinutes
          )
        }
      }
    }

    searchAlgorithm(blueprint, resources, robots, time, maxMinutes)
    return geodeHighScore
  }

  for await (const line of lineReader) {
    const m = line.match(
      /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
    )
    if (m) {
      blueprints.push({
        id: parseInt(m[1]),
        oreRobot: { ore: parseInt(m[2]) },
        clayRobot: { ore: parseInt(m[3]) },
        obsidianRobot: { ore: parseInt(m[4]), clay: parseInt(m[5]) },
        geodeRobot: { ore: parseInt(m[6]), obsidian: parseInt(m[7]) }
      })
    }
  }

  let part1: number = 0
  let part2: number = 1

  if (params.part1?.skip !== true) {
    blueprints.forEach((blueprint) => {
      const finished = getThemGeodes(
        blueprint,
        { ore: 0, clay: 0, obsidian: 0, geode: 0 },
        { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        0,
        params.limit.part1
      )
      log.warn('Blueprint', blueprint.id, 'path', 'geodes', finished)

      part1 += blueprint.id * finished
    })
  }

  if (params.part2?.skip !== true) {
    blueprints.slice(0, 3).forEach((blueprint) => {
      const finished = getThemGeodes(
        blueprint,
        { ore: 0, clay: 0, obsidian: 0, geode: 0 },
        { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        0,
        params.limit.part2
      )
      log.warn('Blueprint', blueprint.id, 'geodes', finished)
      part2 *= finished
    })
  }

  return { part1, part2 }
}

// answer time input: 617.035ms
