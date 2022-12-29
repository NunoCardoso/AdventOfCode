import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const fileSystem: Record<string, any> = {}
  const dirSizes: Record<any, any> = {}
  let currentPath: Array<string> = []
  let part1: number = 0; let part2: number = 0

  for await (const line of lineReader) {
    const vals = line.split(' ')
    if (vals[0] === '$') {
      if (vals[1] === 'cd') {
        if (vals[2] === '/') {
          currentPath = []
        } else if (vals[2] === '..') {
          currentPath.splice(-1)
        } else {
          currentPath = currentPath.concat(vals[2])
        }
      }
    } else {
      const testPath = currentPath.concat(vals[1])
      if (vals[0] === 'dir') {
        if (!_.get(fileSystem, testPath)) {
          _.set(fileSystem, testPath, {})
        }
      } else if (vals[0].match(/^\d+$/)) {
        _.set(fileSystem, testPath, parseInt(vals[0]))
      }
    }
  }

  const calculate = (dir: Record<any, any>, path: Array<string>) => {
    Object.keys(dir).forEach(key => {
      if (_.isNumber(dir[key])) {
        for (let i = 0; i < path.length; i++) {
          const newPath = path.slice(0, i + 1).join('/')
          if (_.isNumber(_.get(dirSizes, newPath))) {
            log.debug('appending', dir[key], 'to ', newPath)
            _.set(dirSizes, newPath, _.get(dirSizes, newPath) + dir[key])
          } else {
            log.debug('creating', dir[key], 'to ', newPath)
            _.set(dirSizes, newPath, dir[key])
          }
        }
        log.debug('done with file', key, ' size ', dir[key], ' to ', path)
      } else {
        const newPath = path.concat(key)
        log.debug('checking dir', newPath.join('/'))
        calculate(dir[key], newPath)
      }
    })
  }

  calculate(fileSystem, [''])

  if (params.part1?.skip !== true) {
    part1 = _.reduce(Object.keys(dirSizes), (memo: number, key: string) => (
      memo + (dirSizes[key] < params!.cutoffDirSize ? dirSizes[key] : 0)
    ), 0)
  }

  // part 2
  if (params.part2?.skip !== true) {
    const totalOccupied = dirSizes['']
    const unusedSpace = params!.totalDiskSize - totalOccupied
    const minimumNeededToDelete = params!.minSpaceFree - unusedSpace
    part2 = params!.totalDiskSize

    Object.keys(dirSizes)
      .sort((a, b) => dirSizes[b] - dirSizes[a])
      .every(key => {
        if (dirSizes[key] < part2 && (dirSizes[key] > minimumNeededToDelete)) {
          part2 = dirSizes[key]
        }
        if (dirSizes[key] < minimumNeededToDelete) {
          return false
        }
        return true
      })
  }

  return { part1, part2 }
}
