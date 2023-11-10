import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Trees = Array<Array<string>>

  const trees: Trees = []
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    trees.push(line.split(''))
  }

  log.info('Matrix of', trees.length, trees[0].length)

  // PART 1
  if (params.part1?.skip !== true) {
    for (let i = 0; i < trees.length; i++) {
      loop: for (let j = 0; j < trees[i].length; j++) {
        if (i === 0 || j === 0 || i === trees.length - 1 || j === trees[i].length - 1) {
          part1++
          log.debug('[' + i + ',' + j + '] tree in edge is visible, total', part1)
          continue loop
        }
        const treeHeight = trees[i][j]
        log.debug('analysing [' + i + ',' + j + '] with height', trees[i][j])
        // left, right, top, bottom
        const visibleArray: Array<boolean> = [true, true, true, true]
        log.debug('checking on left range [' + i + ', 0-' + (j - 1) + ']')
        loopLeft: for (let m = 0; m < j; m++) {
          if (trees[i][m] >= treeHeight) {
            log.debug('on left [' + i + ',' + m + '] with height', trees[i][m], 'not visible')
            visibleArray[0] = false
            break loopLeft
          }
        }

        log.debug('checking on right range [' + i + ', ' + (j + 1) + '-' + (trees[i].length - 1) + ']')
        loopRight: for (let m = j + 1; m < trees[i].length; m++) {
          if (trees[i][m] >= treeHeight) {
            log.debug('on right [' + i + ',' + m + '] with height', trees[i][m], 'not visible')
            visibleArray[1] = false
            break loopRight
          }
        }

        log.debug('checking on top range [0-' + (i - 1) + ',' + j + ']')
        loopTop: for (let m = 0; m < i; m++) {
          if (trees[m][j] >= treeHeight) {
            log.debug('on top [' + m + ',' + j + '] with height', trees[m][j], 'not visible')
            visibleArray[2] = false
            break loopTop
          }
        }

        log.debug('checking on bottom range [' + (i + 1) + '-' + (trees.length - 1) + ',' + j + ']')
        loopBottom: for (let m = i + 1; m < trees.length; m++) {
          if (trees[m][j] >= treeHeight) {
            log.debug('on bottom [' + m + ',' + j + '] with height', trees[m][j], 'not visible')
            visibleArray[3] = false
            break loopBottom
          }
        }

        if (_.find(visibleArray, (v: boolean) => v)) {
          part1++
        }
        log.debug('tree [' + i + ',' + j + '] has visibility', visibleArray, part1)
      }
    }
  }

  // part 2
  if (params.part2?.skip !== true) {
    const treeScores: Record<string, number> = {}
    for (let i = 1; i < trees.length - 1; i++) {
      loop: for (let j = 1; j < trees[i].length - 1; j++) {
        const treeScore = [0, 0, 0, 0]
        const treeHeight = trees[i][j]
        log.debug('analysing [' + i + ',' + j + '] with height', trees[i][j])
        log.debug('checking on left range [' + i + ', 0-' + (j - 1) + ']')
        loopLeft: for (let m = j - 1; m >= 0; m--) {
          treeScore[0]++
          if (trees[i][m] >= treeHeight) {
            log.debug('on left [' + i + ',' + m + '] with height', trees[i][m], 'final one')
            break loopLeft
          } else {
            log.debug('on left [' + i + ',' + m + '] with height', trees[i][m], 'ongoing')
          }
        }

        log.debug('checking on right range [' + i + ', ' + (j + 1) + '-' + (trees[i].length - 1) + ']')
        loopRight: for (let m = j + 1; m < trees[i].length; m++) {
          treeScore[1]++
          if (trees[i][m] >= treeHeight) {
            log.debug('on right [' + i + ',' + m + '] with height', trees[i][m], 'final one')
            break loopRight
          } else {
            log.debug('on right [' + i + ',' + m + '] with height', trees[i][m], 'ongoing')
          }
        }

        log.debug('checking on top range [0-' + (i - 1) + ',' + j + ']')
        loopTop: for (let m = i - 1; m >= 0; m--) {
          treeScore[2]++
          if (trees[m][j] >= treeHeight) {
            log.debug('on top [' + m + ',' + j + '] with height', trees[m][j], 'final one')
            break loopTop
          } else {
            log.debug('on top [' + m + ',' + j + '] with height', trees[m][j], 'ongoing')
          }
        }

        log.debug('checking on bottom range [' + (i + 1) + '-' + (trees.length - 1) + ',' + j + ']')
        loopBottom: for (let m = i + 1; m < trees.length; m++) {
          treeScore[3]++
          if (trees[m][j] >= treeHeight) {
            log.debug('on bottom [' + m + ',' + j + '] with height', trees[m][j], 'final one')
            break loopBottom
          } else {
            log.debug('on bottom [' + m + ',' + j + '] with height', trees[m][j], 'ongoing')
          }
        }

        const finalTreeScore = treeScore[0] * treeScore[1] * treeScore[2] * treeScore[3]
        treeScores['' + i + '-' + j] = finalTreeScore
        log.debug('final score', treeScore, finalTreeScore)
      }
    }
    const treeScoreKeys = Object.keys(treeScores).sort((a, b) => treeScores[b] - treeScores[a])
    part2 = treeScores[treeScoreKeys[0]]
  }

  return { part1, part2 }
}
