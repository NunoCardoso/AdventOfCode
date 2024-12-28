import { Params } from 'aoc.d'
import clc from 'cli-color'

type Cube = [number, number, number]
type Piece = {
  id: number
  cubes: Array<Cube>
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let maxX = 0
  let maxY = 0
  let maxZ = 0
  const pieces: Array<Piece> = []
  let world: Array<any> = []
  let i = 0
  for await (const line of lineReader) {
    const [x1, y1, z1, x2, y2, z2] = line.match(/\d+/g).map(Number)
    const piece: Piece = {
      id: i,
      cubes: []
    }
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          piece.cubes.push([x, y, z])
        }
      }
    }
    pieces.push(piece)
    if (Math.max(x1, x2) > maxX) maxX = Math.max(x1, x2)
    if (Math.max(y1, y2) > maxY) maxY = Math.max(y1, y2)
    if (Math.max(z1, z2) > maxZ) maxZ = Math.max(z1, z2)
    i++
  }

  const canGoDown = (piece: Piece) =>
    // cube below is either empty or belongs to this piece
    piece.cubes.every((cube) => {
      return (
        cube[2] > 1 &&
        (world[cube[0]][cube[1]][cube[2] - 1] === -1 || world[cube[0]][cube[1]][cube[2] - 1] === piece.id)
      )
    })

  const getPiece = (pieceId: number): Piece => pieces.find((p) => p.id === pieceId)!

  const getPiecesUnder = (piece: Piece): Set<number> =>
    new Set(
      piece.cubes
        .filter((c: Cube) => c[2] > 1)
        .map((cube) => world[cube[0]][cube[1]][cube[2] - 1])
        .filter((v: number) => v !== -1 && v !== piece.id)
    )

  const getPiecesAbove = (piece: Piece): Set<number> =>
    new Set(
      piece.cubes
        .filter((c: Cube) => c[2] < maxZ)
        .map((cube) => world[cube[0]][cube[1]][cube[2] + 1])
        .filter((v: number) => v !== -1 && v !== piece.id)
    )

  const moveDown = (index: number) => {
    pieces[index].cubes.forEach((cube, i) => {
      world[cube[0]][cube[1]][cube[2]] = -1
      world[cube[0]][cube[1]][cube[2] - 1] = pieces[index].id
      pieces[index].cubes[i][2] = pieces[index].cubes[i][2] - 1
    })
  }

  const printPiece = (pieceId: number) => {
    const p = getPiece(pieceId)
    return p.id + '(' + p.cubes.map((c) => '[' + c.join(',') + ']') + ')'
  }

  const collectAffectedPieces = (temp: Array<number>, pieceId: number) => {
    const candidatePieces = piecesAbove.get(pieceId)
    // console.log('cap, temp',temp,'pieceId',pieceId,'pieces',pieces)
    if (!candidatePieces || candidatePieces.length === 0) return
    const uniquePieces: Array<number> = []
    candidatePieces.forEach((piece) => {
      if (!temp.includes(piece)) {
        // of couse, one of the supportingPieces is pieceId.
        const otherSupportingPieces = piecesUnder.get(piece)!.filter((p) => p !== pieceId && !temp.includes(p))

        if (otherSupportingPieces!.length === 0) {
          uniquePieces.push(piece)
          temp.push(piece)
        }
      }
    })
    if (uniquePieces.length === 0) return
    uniquePieces.forEach((_piece) => collectAffectedPieces(temp, _piece))
  }

  console.log('world', maxX + 1, maxY + 1, maxZ + 1)
  world = Array(maxX + 1)
    .fill(null)
    .map(() =>
      Array(maxY + 1)
        .fill(null)
        .map(() => Array(maxZ + 1).fill(-1))
    )
  pieces.sort((a, b) => Math.min(...a.cubes.map((_a) => _a[2])) - Math.min(...b.cubes.map((_b) => _b[2])))

  // put pieces into the world
  pieces.forEach((piece: Piece) => {
    piece.cubes.forEach((cube) => {
      world[cube[0]][cube[1]][cube[2]] = piece.id
    })
  })

  // let gravity work
  for (let i = 0; i < pieces.length; i++) {
    while (canGoDown(pieces[i])) {
      // log.debug('moving piece',pieces[i].id,'down')
      moveDown(i)
    }
  }

  // establish which pieces are under
  const piecesUnder: Map<number, Array<number>> = new Map()
  const piecesAbove: Map<number, Array<number>> = new Map()

  pieces.forEach((piece) => {
    // this gets me all pieces that support this piece
    piecesUnder.set(piece.id, Array.from(getPiecesUnder(piece)))
    piecesAbove.set(piece.id, Array.from(getPiecesAbove(piece)))
  })

  // pieces that are supported by only one piece can NOT be safely removed
  const pieceIDsThatCannotBeRemoved = Array.from(
    new Set(
      Array.from(piecesUnder.values())
        .filter((v) => v.length === 1)
        .flat()
    )
  )

  if (!params.skipPart1) {
    // pieces that can be removed = all - pieces that cannot be removed
    part1 = pieces.length - pieceIDsThatCannotBeRemoved.length
  }

  if (!params.skipPart2) {
    part2 = pieceIDsThatCannotBeRemoved.reduce((a, piece) => {
      const temp: Array<number> = []
      collectAffectedPieces(temp, piece)
      return a + temp.length
    }, 0)
  }

  return { part1, part2 }
}
