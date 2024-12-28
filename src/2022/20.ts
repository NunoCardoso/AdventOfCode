import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  /* don't ask, see the test */
  const getNewIndex = (_oldIndex: number, _shiftHowMuch: number, _listLength: number) => {
    if (_shiftHowMuch === 0) {
      return _oldIndex
    }

    const modifiedShift = _shiftHowMuch % (_listLength - 1)
    let res = _oldIndex + modifiedShift
    if (_oldIndex + modifiedShift <= 0) {
      while (res <= 0) {
        res += _listLength
        if (res < _oldIndex + 2) {
          res -= 1
        }
      }
    } else if (_oldIndex + modifiedShift >= _listLength) {
      res = _oldIndex + modifiedShift
      while (res >= _listLength) {
        res -= _listLength
        res += 1
      }
      if (res > _oldIndex) {
        res += 1
      }
    } else if (_oldIndex + modifiedShift > 0 && _oldIndex + modifiedShift < _listLength) {
      if (res > _oldIndex) {
        res += 1
      }
    }
    return res
  }

  const doMixIn = (mainList: Array<number>, indexList: Array<number>) => {
    const listLength = mainList.length

    for (let i = 0; i < listLength; i++) {
      log.debug('begin mixin for element at', i, 'from', mainList)

      const oldIndex = indexList.indexOf(i)
      const shiftHowMuch: number = mainList[oldIndex]

      const newIndex = getNewIndex(oldIndex, shiftHowMuch, listLength)
      if (newIndex !== 0) {
        if (newIndex > oldIndex) {
          log.debug('new >>> old')
          let temp = mainList[oldIndex]
          mainList.splice(newIndex, 0, temp)
          mainList.splice(oldIndex, 1)

          temp = indexList[oldIndex]
          indexList.splice(newIndex, 0, temp)
          indexList.splice(oldIndex, 1)
        } else if (newIndex < oldIndex) {
          log.debug('new <<< old')

          let temp = mainList[oldIndex]
          mainList.splice(oldIndex, 1)
          mainList.splice(newIndex, 0, temp)

          temp = indexList[oldIndex]
          indexList.splice(oldIndex, 1)
          indexList.splice(newIndex, 0, temp)
        }
      }

      if (mainList.length !== listLength) {
        throw new Error()
      }
      log.debug('end mix at element', i, mainList)
    }
    log.debug('final', mainList)
    return mainList
  }

  const mainList1: Array<number> = []
  const indexList1: Array<number> = []
  let j: number = 0

  for await (const line of lineReader) {
    mainList1.push(parseInt(line))
    indexList1.push(j)
    j++
  }
  let mainList2: Array<number> = _.cloneDeep(mainList1)
  const indexList2: Array<number> = _.cloneDeep(indexList1)

  let oldIndex, index1, index2, index3
  let part1: number = 0
  let part2: number = 0

  if (params.part1?.skip !== true) {
    doMixIn(mainList1, indexList1)
    oldIndex = mainList1.indexOf(0)

    index1 = (oldIndex + 1000) % mainList1.length
    index2 = (oldIndex + 2000) % mainList1.length
    index3 = (oldIndex + 3000) % mainList1.length
    part1 = mainList1[index1] + mainList1[index2] + mainList1[index3]
  }

  if (params.part2?.skip !== true) {
    mainList2 = mainList2.map((v: number) => v * params!.decriptionKey)
    for (let i = 0; i < 10; i++) {
      doMixIn(mainList2, indexList2)
    }
    oldIndex = mainList2.indexOf(0)
    index1 = (oldIndex + 1000) % mainList2.length
    index2 = (oldIndex + 2000) % mainList2.length
    index3 = (oldIndex + 3000) % mainList2.length
    part2 = mainList2[index1] + mainList2[index2] + mainList2[index3]
  }

  return { part1, part2 }
}
