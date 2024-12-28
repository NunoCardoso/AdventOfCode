import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Blueprint = [number, number, number, [number, number], [number, number]]
  type Resources = [number, number, number, number]
  type Robots = Resources

  const blueprints: Array<Blueprint> = []

  const haveResourcesForGeodeRobot = (blueprint: Blueprint, obsidian: number, ore: number) =>
    obsidian >= blueprint[4][1] && ore >= blueprint[4][0]

  const haveResourcesForObsidianRobot = (blueprint: Blueprint, clay: number, ore: number) =>
    clay >= blueprint[3][1] && ore >= blueprint[3][0]

  const haveResourcesForClayRobot = (blueprint: Blueprint, ore: number) => ore >= blueprint[2]

  const haveResourcesForOreRobot = (blueprint: Blueprint, ore: number) => ore >= blueprint[1]

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
          Math.ceil((blueprint[4][1] - obsidian) / obsidianRobot),
          Math.ceil((blueprint[4][0] - ore) / oreRobot)
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
      : Math.max(Math.ceil((blueprint[3][1] - clay) / clayRobot), Math.ceil((blueprint[3][0] - ore) / oreRobot)))

  const timeToMakeAClayRobot = (blueprint: Blueprint, ore: number, oreRobot: number): number =>
    1 + (haveResourcesForClayRobot(blueprint, ore) ? 0 : Math.ceil((blueprint[2] - ore) / oreRobot))

  const timeToMakeAnOreRobot = (blueprint: Blueprint, ore: number, oreRobot: number): number =>
    1 + (haveResourcesForOreRobot(blueprint, ore) ? 0 : Math.ceil((blueprint[1] - ore) / oreRobot))

  const canBuildGeodeRobot = (blueprint: Blueprint, obsidianRobot: number) => obsidianRobot > 0

  const canBuildObsidianRobot = (blueprint: Blueprint, clayRobot: number) => clayRobot > 0

  const getThemGeodes = (
    blueprint: Blueprint,
    ore: number,
    clay: number,
    obsidian: number,
    geode: number,
    oreRobot: number,
    clayRobot: number,
    obsidianRobot: number,
    geodeRobot: number,
    time: number,
    maxMinutes: number
  ) => {
    // I should have max robots that allow me to build any robot in 1 min.
    const maxRobots: Robots = [
      Math.max(blueprint[4][0], blueprint[3][0], blueprint[2], blueprint[1]),
      blueprint[3][1],
      blueprint[4][1],
      100
    ]
    let geodeHighScore: number = 0

    const searchAlgorithm = (
      blueprint: Blueprint,
      ore: number,
      clay: number,
      obsidian: number,
      geode: number,
      oreRobot: number,
      clayRobot: number,
      obsidianRobot: number,
      geodeRobot: number,
      time: number,
      maxMinutes: number
    ) => {
      if (time >= maxMinutes) {
        return
      }

      if (geodeHighScore < geode && ore >= 0) {
        log.debug('Better finish', geode)
        geodeHighScore = geode
      }

      if (canBuildGeodeRobot(blueprint, obsidianRobot)) {
        log.trace('I can build geode robot')
        const newTime: number = timeToMakeAGeodeRobot(blueprint, obsidian, ore, obsidianRobot, oreRobot)
        searchAlgorithm(
          blueprint,
          ore - blueprint[4][0] + oreRobot * newTime,
          clay + clayRobot * newTime,
          obsidian - blueprint[4][1] + obsidianRobot * newTime,
          geode + maxMinutes - (time + newTime),
          oreRobot,
          clayRobot,
          obsidianRobot,
          geodeRobot + 1,
          time + newTime,
          maxMinutes
        )
        // if I am making geode robots in one minute, then don't do anything else
        if (newTime === 1) {
          return
        }
      }

      if (canBuildObsidianRobot(blueprint, clayRobot)) {
        log.trace('can build obsidian robot')

        const newTime: number = timeToMakeAnObsidianRobot(blueprint, clay, ore, clayRobot, oreRobot)
        // we can still build an obsidian robot in max - 2, a geode in max -1, and have one last geode, hence the -2
        if (maxMinutes - (time + newTime) > 2) {
          searchAlgorithm(
            blueprint,
            ore - blueprint[3][0] + oreRobot * newTime,
            clay - blueprint[3][1] + clayRobot * newTime,
            obsidian + obsidianRobot * newTime,
            geode,
            oreRobot,
            clayRobot,
            obsidianRobot + 1,
            geodeRobot,
            time + newTime,
            maxMinutes
          )
        }
      }

      if (clayRobot <= maxRobots[1]) {
        const newTime: number = timeToMakeAClayRobot(blueprint, ore, oreRobot)
        if (maxMinutes - (time + newTime) > 3) {
          searchAlgorithm(
            blueprint,
            ore - blueprint[2] + oreRobot * newTime,
            clay + clayRobot * newTime,
            obsidian + obsidianRobot * newTime,
            geode,
            oreRobot,
            clayRobot + 1,
            obsidianRobot,
            geodeRobot,
            time + newTime,
            maxMinutes
          )
        }
      }

      if (oreRobot <= maxRobots[0]) {
        const newTime: number = timeToMakeAnOreRobot(blueprint, ore, oreRobot)
        if (maxMinutes - (time + newTime) > 4) {
          searchAlgorithm(
            blueprint,
            ore - blueprint[1] + oreRobot * newTime,
            clay + clayRobot * newTime,
            obsidian + obsidianRobot * newTime,
            geode,
            oreRobot + 1,
            clayRobot,
            obsidianRobot,
            geodeRobot,
            time + newTime,
            maxMinutes
          )
        }
      }
    }

    searchAlgorithm(
      blueprint,
      ore,
      clay,
      obsidian,
      geode,
      oreRobot,
      clayRobot,
      obsidianRobot,
      geodeRobot,
      time,
      maxMinutes
    )
    return geodeHighScore
  }

  for await (const line of lineReader) {
    const m = line.match(
      /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
    )
    if (m) {
      blueprints.push([
        parseInt(m[1]),
        parseInt(m[2]),
        parseInt(m[3]),
        [parseInt(m[4]), parseInt(m[5])],
        [parseInt(m[6]), parseInt(m[7])]
      ])
    }
  }

  let part1: number = 0
  let part2: number = 1

  if (params.part1?.skip !== true) {
    blueprints.forEach((blueprint) => {
      const finished = getThemGeodes(blueprint, 0, 0, 0, 0, 1, 0, 0, 0, 0, params.limit.part1)
      log.info('Blueprint', blueprint[0], 'path', 'geodes', finished)

      part1 += blueprint[0] * finished
    })
  }

  if (params.part2?.skip !== true) {
    blueprints.slice(0, 3).forEach((blueprint) => {
      const finished = getThemGeodes(blueprint, 0, 0, 0, 0, 1, 0, 0, 0, 0, params.limit.part2)
      log.info('Blueprint', blueprint[0], 'geodes', finished)
      part2 *= finished
    })
  }

  return { part1, part2 }
}
