import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let disk: number[] = []
  for await (const line of lineReader) disk = line.split('').map(Number)

  const isFile = (index: number) => index % 2 === 0

  const getFileId = (leftCursor: number) => Math.floor(leftCursor / 2)

  const solveForPart1 = (disk: number[]): number => {
    let cursor = disk.length - 1
    let virtualDisk: number[][] = disk.map((d, cursor) => new Array(d).fill(isFile(cursor) ? getFileId(cursor) : null))
    let virtualCursor = 1 // points to the disk place where there is empty space

    while (virtualCursor < cursor) {
      if (!isFile(cursor)) {
        virtualDisk.pop()
        cursor--
      }
      // it is a file, find the available slots
      let values: number[] = virtualDisk.pop()!
      while (values.length > 0) {
        if (virtualCursor < virtualDisk.length) {
          if (virtualDisk[virtualCursor]) {
            let index = virtualDisk[virtualCursor].findIndex((x) => x === null)
            if (index >= 0) {
              virtualDisk[virtualCursor][index] = values.pop()!
            } else {
              // out of space. move to next space slot
              virtualCursor += 2
            }
          }
        } else {
          virtualDisk[virtualCursor] = values
          values = []
          virtualCursor = virtualDisk.length + 1 // break cycle
        }
      }
    }
    return virtualDisk.flat().reduce((acc, val, index) => acc + val * index, 0)
  }

  const solveForPart2 = (disk: number[]): number => {
    let cursor = disk.length - 1
    let virtualDisk = disk.map((d, cursor) => new Array(d).fill(isFile(cursor) ? getFileId(cursor) : null))
    while (cursor > 0) {
      if (!isFile(cursor)) cursor--
      // it is a file, find the first available slot
      let index = virtualDisk.findIndex((v) => v.filter((vv) => vv === null).length >= disk[cursor])
      if (index >= 0 && index < cursor) {
        // find a slot, but it cannot be on the right side of cursorright
        // erase the ones we are moving with null => we need the space
        virtualDisk[cursor] = virtualDisk[cursor].map((x) => null)
        // fit the file into the space slot
        let firstAvailableSpace = virtualDisk[index].findIndex((slot) => slot === null)
        for (var i = firstAvailableSpace; i < firstAvailableSpace + disk[cursor]; i++) {
          virtualDisk[index][i] = getFileId(cursor)
        }
      }
      cursor--
    }
    return virtualDisk.flat().reduce((acc, val, index) => acc + val * index, 0)
  }

  if (!params.skipPart1) {
    part1 = solveForPart1(disk)
  }
  if (!params.skipPart2) {
    part2 = solveForPart2(disk)
  }

  return { part1, part2 }
}
