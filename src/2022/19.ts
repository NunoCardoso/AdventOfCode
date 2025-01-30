import { Params } from 'aoc.d'

type Step = [
  ore: number,
  clay: number,
  obsidian: number,
  geode: number,
  oreRobot: number,
  clayRobot: number,
  obsidianRobot: number,
  geodeRobot: number,
  time: number
]

type Blueprint = [
  id: number,
  oreRobotOre: number,
  clayRobotOre: number,
  [obsidianRobotOre: number, obsidianRobotClay: number],
  [geodeRobotOre: number, geodeRobotObsidian: number]
]
type Resources = [number, number, number, number]
type Robots = Resources

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const haveResourcesForGeodeRobot = (blueprint: Blueprint, obsidian: number, ore: number) =>
    obsidian >= blueprint[4][1] && ore >= blueprint[4][0]

  const haveResourcesForObsidianRobot = (blueprint: Blueprint, clay: number, ore: number) =>
    clay >= blueprint[3][1] && ore >= blueprint[3][0]

  const haveResourcesForClayRobot = (blueprint: Blueprint, ore: number) => ore >= blueprint[2]

  const haveResourcesForOreRobot = (blueprint: Blueprint, ore: number) => ore >= blueprint[1]

  // estimate time to make a geode robot
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

  const doDeepFirst = (
    blueprint: Blueprint,
    maxMinutes: number,
    [ore, clay, obsidian, geode, oreRobot, clayRobot, obsidianRobot, geodeRobot, time]: Step,
    data: any
  ) => {
    if (time >= maxMinutes) return
    if (data.geodeHighScore < geode && ore >= 0) {
      log.debug('Better finish', geode)
      data.geodeHighScore = geode
    }

    if (canBuildGeodeRobot(blueprint, obsidianRobot)) {
      log.trace('I can build geode robot')
      const newTime: number = timeToMakeAGeodeRobot(blueprint, obsidian, ore, obsidianRobot, oreRobot)
      doDeepFirst(
        blueprint,
        maxMinutes,
        [
          ore - blueprint[4][0] + oreRobot * newTime,
          clay + clayRobot * newTime,
          obsidian - blueprint[4][1] + obsidianRobot * newTime,
          geode + maxMinutes - (time + newTime),
          oreRobot,
          clayRobot,
          obsidianRobot,
          geodeRobot + 1,
          time + newTime
        ],
        data
      )
      // if I am making geode robots in one minute, then don't do anything else,
      // do not purse the other paths.
      if (newTime === 1) return
    }

    if (canBuildObsidianRobot(blueprint, clayRobot)) {
      log.trace('can build obsidian robot')

      const newTime: number = timeToMakeAnObsidianRobot(blueprint, clay, ore, clayRobot, oreRobot)
      // we can still build an obsidian robot in max - 2, a geode in max -1, and have one last geode, hence the -2
      if (maxMinutes - (time + newTime) > 2) {
        doDeepFirst(
          blueprint,
          maxMinutes,
          [
            ore - blueprint[3][0] + oreRobot * newTime,
            clay - blueprint[3][1] + clayRobot * newTime,
            obsidian + obsidianRobot * newTime,
            geode,
            oreRobot,
            clayRobot,
            obsidianRobot + 1,
            geodeRobot,
            time + newTime
          ],
          data
        )
      }
    }

    if (clayRobot <= data.maxRobots[1]) {
      const newTime: number = timeToMakeAClayRobot(blueprint, ore, oreRobot)
      if (maxMinutes - (time + newTime) > 8) {
        // no need for clay robots in the end
        doDeepFirst(
          blueprint,
          maxMinutes,
          [
            ore - blueprint[2] + oreRobot * newTime,
            clay + clayRobot * newTime,
            obsidian + obsidianRobot * newTime,
            geode,
            oreRobot,
            clayRobot + 1,
            obsidianRobot,
            geodeRobot,
            time + newTime
          ],
          data
        )
      }
    }

    if (oreRobot <= data.maxRobots[0]) {
      const newTime: number = timeToMakeAnOreRobot(blueprint, ore, oreRobot)
      if (maxMinutes - (time + newTime) > 9) {
        // no need for clay robots in the end
        doDeepFirst(
          blueprint,
          maxMinutes,
          [
            ore - blueprint[1] + oreRobot * newTime,
            clay + clayRobot * newTime,
            obsidian + obsidianRobot * newTime,
            geode,
            oreRobot + 1,
            clayRobot,
            obsidianRobot,
            geodeRobot,
            time + newTime
          ],
          data
        )
      }
    }
  }

  const solveFor = (blueprint: Blueprint, maxMinutes: number, step: Step) => {
    // I should check if I have enough resources to build any robot in 1 min.
    // this helps to trim down the branch, by not checking paths that builds other robots when
    // i can build geode robots / obsidian robots in one go
    // necessary.
    const maxRobots: Robots = [
      Math.max(blueprint[4][0], blueprint[3][0], blueprint[2], blueprint[1]), // ore
      blueprint[3][1], // clay
      blueprint[4][1], // obsidian
      100
    ]
    const data: any = {
      geodeHighScore: 0,
      maxRobots
    }
    doDeepFirst(blueprint, maxMinutes, step, data)
    return data.geodeHighScore
  }

  const blueprints: Blueprint[] = []
  for await (const line of lineReader) {
    const [, id, oreRobotOre, clayRobotOre, obsidianRobotOre, obsidianRobotClay, geodeRobotOre, geodeRobotObsidian] =
      line.match(
        /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
      )
    blueprints.push([
      +id,
      +oreRobotOre,
      +clayRobotOre,
      [+obsidianRobotOre, +obsidianRobotClay],
      [+geodeRobotOre, +geodeRobotObsidian]
    ])
  }

  part1 = blueprints.reduce(
    (acc, blueprint) => acc + blueprint[0] * solveFor(blueprint, params.limit.part1, [0, 0, 0, 0, 1, 0, 0, 0, 0]),
    0
  )

  part2 = blueprints
    .slice(0, 3)
    .reduce((acc, blueprint) => acc * solveFor(blueprint, params.limit.part2, [0, 0, 0, 0, 1, 0, 0, 0, 0]), 1)

  return { part1, part2 }
}
