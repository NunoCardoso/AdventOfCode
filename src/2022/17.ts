import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location } from 'declarations'

type Well = string[]
type Rock = Location[]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const makeNewRock = (rockNumber: number, leftmostPosition: number, bottommostPosition: number): Rock => {
    if (rockNumber % 5 === 0) {
      //   ####
      return [
        [leftmostPosition, bottommostPosition],
        [leftmostPosition + 1, bottommostPosition],
        [leftmostPosition + 2, bottommostPosition],
        [leftmostPosition + 3, bottommostPosition]
      ]
    }
    if (rockNumber % 5 === 1) {
      // .#.
      // ###
      // .#.
      return [
        [leftmostPosition, bottommostPosition + 1],
        [leftmostPosition + 1, bottommostPosition + 1],
        [leftmostPosition + 2, bottommostPosition + 1],
        [leftmostPosition + 1, bottommostPosition],
        [leftmostPosition + 1, bottommostPosition + 2]
      ]
    }
    if (rockNumber % 5 === 2) {
      // ..#
      // ..#
      // ###
      return [
        [leftmostPosition, bottommostPosition],
        [leftmostPosition + 1, bottommostPosition],
        [leftmostPosition + 2, bottommostPosition],
        [leftmostPosition + 2, bottommostPosition + 1],
        [leftmostPosition + 2, bottommostPosition + 2]
      ]
    }
    if (rockNumber % 5 === 3) {
      // #
      // #
      // #
      // #
      return [
        [leftmostPosition, bottommostPosition],
        [leftmostPosition, bottommostPosition + 1],
        [leftmostPosition, bottommostPosition + 2],
        [leftmostPosition, bottommostPosition + 3]
      ]
    }

    // ##
    // ##
    return [
      [leftmostPosition, bottommostPosition],
      [leftmostPosition, bottommostPosition + 1],
      [leftmostPosition + 1, bottommostPosition + 1],
      [leftmostPosition + 1, bottommostPosition]
    ]
  }

  const makeWind = (wind: string, well: Well, rock: Rock) => {
    if (wind === '>') {
      const cantMoveToRight = rock.some((location: Location) => {
        // out of bounds
        if (location[0] >= wellWidth - 1) return true
        // there are pieces on the right and inside the well
        if (location[1] < well.length && well[location[1]].split('')[location[0] + 1] === '#') return true
      })
      // just move 1 step on X axis
      if (!cantMoveToRight) rock.forEach((location) => location[0]++)
    }
    if (wind === '<') {
      const cantMoveToLeft = rock.some((location: Location) => {
        // out of bounds
        if (location[0] <= 0) return true
        // Location Y is inside well and occupied on left
        if (location[1] < well.length && well[location[1]].split('')[location[0] - 1] === '#') return true
      })
      if (!cantMoveToLeft) rock.forEach((location) => location[0]--)
    }
  }
  const makeGravity = (rock: Rock) => rock.forEach((p) => p[1]--)

  const checkIfStopped = (well: Well, rock: Rock): boolean =>
    rock.some((p: Location) => {
      // we hit the bottom
      if (p[1] === 0) return true
      const rowToCheck = p[1] - 1
      if (rowToCheck < well.length && well[rowToCheck].split('')[p[0]] === '#') return true
      return false
    })

  const addRock = (well: Well, rock: Rock) =>
    rock.forEach((piece: Location) => {
      if (piece[1] > well.length - 1) {
        for (let i = well.length; i <= piece[1]; i++) well.push('.'.repeat(wellWidth))
      }
      const wellRowSplits = well[piece[1]].split('')
      wellRowSplits[piece[0]] = '#'
      well[piece[1]] = wellRowSplits.join('')
    })

  const printWell = (well: Well, rock?: Rock) => {
    const line = [...well]
    rock?.forEach((piece: Location) => {
      if (piece[1] > line.length - 1) {
        for (let i = well.length; i <= piece[1]; i++) {
          line.push('.'.repeat(wellWidth))
        }
      }
      const wellRowSplits = line[piece[1]].split('')
      wellRowSplits[piece[0]] = '@'
      line[piece[1]] = wellRowSplits.join('')
    })

    for (let i = line.length - 1; i >= 0; i--) {
      log.info(clc.cyan('|') + line[i].replaceAll('@', clc.red('@')).replaceAll('#', clc.yellow('#')) + clc.cyan('|'))
    }
    log.info(clc.cyan('+' + '-'.repeat(wellWidth) + '|') + '\n')
  }

  const doTetris = (well: Well, windData: string[], finalTarget: number) => {
    let numberRocks: number = 0
    let windIterations = 0

    let rocksFirstStage: number = 0
    let rocksSecondStage: number = 0
    let heightFirstStage: number = 0
    let heightSecondStage: number = 0
    let howMuchHeightToAddLater: number = 0

    const firstCutoff = windData.length * 5
    const secondCutoff = windData.length * 5 * 2

    while (numberRocks < finalTarget) {
      const leftborder = 2
      const bottomborder = well.length + 3
      const rock = makeNewRock(numberRocks, leftborder, bottomborder)

      while (true) {
        const windIndex = windIterations % windData.length
        windIterations++

        if (windIterations === firstCutoff) {
          heightFirstStage = well.length
          rocksFirstStage = numberRocks
          log.trace(
            'First cutoff, number rocks',
            rocksFirstStage,
            'wind iteration',
            windIterations,
            'height',
            heightFirstStage
          )
        }
        if (windIterations === secondCutoff) {
          heightSecondStage = well.length - heightFirstStage
          rocksSecondStage = numberRocks - rocksFirstStage
          log.trace(
            'Second cutoff, number rocks',
            rocksSecondStage,
            'wind iteration',
            windIterations,
            'height',
            heightSecondStage
          )

          const howManyTimesICanRepeatThePattern = Math.floor((finalTarget - rocksFirstStage) / rocksSecondStage)
          log.trace('I think pattern repeats', howManyTimesICanRepeatThePattern, 'times')
          const howManyRocksNow = rocksFirstStage + howManyTimesICanRepeatThePattern * rocksSecondStage
          log.trace(
            'Rocks grow',
            howManyTimesICanRepeatThePattern,
            'times',
            rocksSecondStage,
            '+',
            rocksFirstStage,
            '=',
            howManyRocksNow
          )
          howMuchHeightToAddLater = howManyTimesICanRepeatThePattern * heightSecondStage
          log.trace(
            'height grow',
            howManyTimesICanRepeatThePattern,
            'times',
            heightSecondStage,
            '=',
            howMuchHeightToAddLater
          )
          // I have to remove the time I added already
          howMuchHeightToAddLater = howMuchHeightToAddLater - heightSecondStage
          log.trace('howMuchHeightToAddLater', howMuchHeightToAddLater)
          numberRocks = howManyRocksNow
          log.trace('writing rocks', howManyRocksNow)
        }

        const wind = windData[windIndex]
        makeWind(wind, well, rock)

        if (!checkIfStopped(well, rock)) makeGravity(rock)
        else break
        if (params.ui?.show && params.ui?.during) {
          printWell(well, rock)
        }
      }
      addRock(well, rock)
      if (params.ui?.show && params.ui?.end) printWell(well)
      numberRocks++
    }
    const finalHeight = well.length + howMuchHeightToAddLater
    log.trace('doRun complete, number of rocks', numberRocks, 'height', finalHeight) //, 'first line', well[0],'last line', well[well.length -1])
    return finalHeight
  }

  const wellWidth: number = params!.wellWidth

  let windData: string[] = []
  for await (const line of lineReader) windData = line.split('')

  if (params.part1?.skip !== true) part1 = doTetris([], windData, params!.rocks.part1)
  if (params.part2?.skip !== true) part2 = doTetris([], windData, params!.rocks.part2)

  return { part1, part2 }
}
