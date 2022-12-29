import { Params } from '../../aoc.d'
import _ from 'lodash'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let windData: Array<string>
  type Point = Array<number>
  type Well = Array<string>
  type Rock = Array<Point>

  const newRock = (i: number, leftmostPos: number, bottommostPos: number): Rock => {
    if (i % 5 === 0) {
      //   ####
      return [
        [leftmostPos, bottommostPos],
        [leftmostPos + 1, bottommostPos],
        [leftmostPos + 2, bottommostPos],
        [leftmostPos + 3, bottommostPos]
      ]
    }
    if (i % 5 === 1) {
      // .#.
      // ###
      // .#.
      return [
        [leftmostPos, bottommostPos + 1],
        [leftmostPos + 1, bottommostPos + 1],
        [leftmostPos + 2, bottommostPos + 1],
        [leftmostPos + 1, bottommostPos],
        [leftmostPos + 1, bottommostPos + 2]
      ]
    }
    if (i % 5 === 2) {
      // ..#
      // ..#
      // ###
      return [
        [leftmostPos, bottommostPos],
        [leftmostPos + 1, bottommostPos],
        [leftmostPos + 2, bottommostPos],
        [leftmostPos + 2, bottommostPos + 1],
        [leftmostPos + 2, bottommostPos + 2]
      ]
    }
    if (i % 5 === 3) {
      // #
      // #
      // #
      // #
      return [
        [leftmostPos, bottommostPos],
        [leftmostPos, bottommostPos + 1],
        [leftmostPos, bottommostPos + 2],
        [leftmostPos, bottommostPos + 3]
      ]
    }

    // ##
    // ##
    return [
      [leftmostPos, bottommostPos],
      [leftmostPos, bottommostPos + 1],
      [leftmostPos + 1, bottommostPos + 1],
      [leftmostPos + 1, bottommostPos]
    ]
  }

  const makeWind = (wind: string, well: Well, rock: Array<Point>) => {
    if (wind === '>') {
      const cantMoveToRight = _.find(rock, (p: Point) => {
        // out of bounds
        if (p[0] >= wellWidth - 1) {
          return true
        }
        // point Y is inside well and occupied on right
        if (p[1] < well.length) {
          const wellRow = well[p[1]]
          if (wellRow.split('')[p[0] + 1] === '#') {
            return true
          }
        }
      })
      if (!cantMoveToRight) {
        rock.map(p => p[0]++)
      }
    }
    if (wind === '<') {
      const cantMoveToLeft = _.find(rock, (p: Point) => {
        // out of bounds
        if (p[0] <= 0) {
          return true
        }
        // point Y is inside well and occupied on left
        if (p[1] < well.length) {
          const wellRow = well[p[1]]
          if (wellRow.split('')[p[0] - 1] === '#') {
            return true
          }
        }
      })
      if (!cantMoveToLeft) {
        rock.map(p => p[0]--)
      }
    }
  }
  const makeGravity = (rock: Array<Point>) => {
    rock.map(p => p[1]--)
  }

  const checkIfStopped = (well: Well, rock: Rock): boolean => {
    const stopped = _.find(rock, (p: Point) => {
      // we hit the bottom
      if (p[1] === 0) {
        return true
      }
      const rowToCheck = p[1] - 1
      if (rowToCheck < well.length) {
        const wellRow = well[rowToCheck]
        if (wellRow.split('')[p[0]] === '#') {
          return true
        }
      }
      return false
    }) !== undefined
    return stopped
  }

  const addRock = (well: Well, rock: Rock) => {
    rock.forEach((piece: Point) => {
      if (piece[1] > well.length - 1) {
        for (let i = well.length; i <= piece[1]; i++) {
          well.push('.'.repeat(wellWidth))
        }
      }
      const wellRowSplits = well[piece[1]].split('')
      wellRowSplits[piece[0]] = '#'
      well[piece[1]] = wellRowSplits.join('')
    })
  }

  const printWell = (well: Well, rock?: Rock) => {
    const line = _.cloneDeep(well)
    if (rock) {
      rock.forEach((piece: Point) => {
        if (piece[1] > line.length - 1) {
          for (let i = well.length; i <= piece[1]; i++) {
            line.push('.'.repeat(wellWidth))
          }
        }
        const wellRowSplits = line[piece[1]].split('')
        wellRowSplits[piece[0]] = '@'
        line[piece[1]] = wellRowSplits.join('')
      })
    }

    for (let i = line.length - 1; i >= 0; i--) {
      console.log(clc.cyan('|') +
        line[i].replaceAll('@', clc.red('@')).replaceAll('#', clc.yellow('#')) +
        clc.cyan('|')
      )
    }
    console.log(clc.cyan('+' + '-'.repeat(wellWidth) + '|'))
    console.log('\n')
  }

  const doTetris = (well: Well, finalTarget: number) => {
    log.info('number of wind changes', windData.length)
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
      const rock = newRock(numberRocks, leftborder, bottomborder)
      let stopped: boolean = false

      while (!stopped) {
        const windIndex = windIterations % windData.length
        const wind = windData[windIndex]
        makeWind(wind, well, rock)
        const _stopped: boolean = checkIfStopped(well, rock)
        if (_stopped) {
          stopped = _stopped
        } else {
          makeGravity(rock)
        }
        if (params.ui?.show && params.ui?.during) {
          printWell(well, rock)
        }
        windIterations++

        if (windIterations === firstCutoff) {
          heightFirstStage = well.length
          rocksFirstStage = numberRocks
          log.info('First cutoff, number rocks', rocksFirstStage, 'wind iteration', windIterations, 'height', heightFirstStage)
        }
        if (windIterations === secondCutoff) {
          heightSecondStage = well.length - heightFirstStage
          rocksSecondStage = numberRocks - rocksFirstStage
          log.info('Second cutoff, number rocks', rocksSecondStage, 'wind iteration', windIterations, 'height', heightSecondStage)

          const howManyTimesICanRepeatThePattern = Math.floor((finalTarget - rocksFirstStage) / rocksSecondStage)
          log.info('I think pattern repeats', howManyTimesICanRepeatThePattern, 'times')
          const howManyRocksNow = rocksFirstStage + howManyTimesICanRepeatThePattern * rocksSecondStage
          log.info('Rocks grow', howManyTimesICanRepeatThePattern, 'times', rocksSecondStage, '+', rocksFirstStage, '=', howManyRocksNow)
          howMuchHeightToAddLater = howManyTimesICanRepeatThePattern * heightSecondStage
          log.info('height grow', howManyTimesICanRepeatThePattern, 'times', heightSecondStage, '=', howMuchHeightToAddLater)
          // I have to remove the time I added already
          howMuchHeightToAddLater = howMuchHeightToAddLater - heightSecondStage
          log.info('howMuchHeightToAddLater', howMuchHeightToAddLater)
          numberRocks = howManyRocksNow
          log.info('writing rocks', howManyRocksNow)
        }
      }
      addRock(well, rock)
      if (params.ui?.show && params.ui?.end) {
        printWell(well)
      }
      numberRocks++
    }
    const finalHeight = well.length + howMuchHeightToAddLater
    log.info('doRun complete, number of rocks', numberRocks, 'height', finalHeight)//, 'first line', well[0],'last line', well[well.length -1])
    return finalHeight
  }

  const wellWidth: number = params!.wellWidth
  const well1: Well = []
  const well2: Well = []
  let part1: number = 0; let part2: number = 0

  for await (const line of lineReader) {
    windData = line.split('')
  }
  if (params.part1?.skip !== true) {
    part1 = doTetris(well1, params!.part1.rocks)
  }
  if (params.part2?.skip !== true) {
    part2 = doTetris(well2, params!.part2.rocks)
  }

  return {
    part1,
    part2
  }
}
