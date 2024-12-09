import { Params } from 'aoc.d'
import { Point, World } from '../declarations'

type Direction = '<' | '>' | '^' | 'v'

type Turn = 'left' | 'straight' | 'right'
type Cart = {
  id: number
  location: Point
  direction: Direction
  nextTurn: Turn
  active: boolean
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  let world: World<string> = []
  let carts: Cart[] = []

  const replaceCharacter = (world: World<string>, rowIndex: number, colIndex: number) => {
    // need to replace the value, let's assume it can be |, - or +
    let trackOnLeft = colIndex > 0 ? ['-', '/', '\\', '+'].includes(world[rowIndex][colIndex - 1]) : false
    let trackOnRight =
      colIndex < world[rowIndex].length - 1
        ? ['-', '/', '\\', '+'].includes(world[rowIndex][colIndex + 1])
        : false
    let trackOnTop = rowIndex > 0 ? ['|', '/', '\\', '+'].includes(world[rowIndex - 1][colIndex]) : false
    let trackOnBottom =
      rowIndex < world.length - 1 ? ['|', '/', '\\', '+'].includes(world[rowIndex + 1][colIndex]) : false
    if (trackOnLeft && trackOnBottom && !trackOnRight && !trackOnTop) return '\\'
    if (trackOnRight && trackOnTop && !trackOnLeft && !trackOnBottom) return '\\'
    if (trackOnLeft && trackOnTop && !trackOnRight && !trackOnBottom) return '/'
    if (trackOnRight && trackOnBottom && !trackOnLeft && !trackOnTop) return '/'
    if (trackOnRight && trackOnLeft && !trackOnTop && !trackOnBottom) return '-'
    if (!trackOnRight && !trackOnLeft && trackOnTop && trackOnBottom) return '|'
    //if (trackOnRight && trackOnLeft && trackOnTop && trackOnBottom)
    return '+'
  }

  for await (const line of lineReader) world.push(line.split(''))

  world.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (['<', '>', 'v', '^'].includes(cell)) {
        carts.push({
          id: carts.length,
          location: [rowIndex, colIndex],
          direction: cell as Direction,
          nextTurn: 'left',
          active: true
        })
        world[rowIndex][colIndex] = replaceCharacter(world, rowIndex, colIndex)
      }
    })
  })

  const printWorld = (world: World<string>) => {
    world.forEach((row) => console.log(row.join('')))
  }

  const getNextTurn = (turn: Turn): Turn => {
    let values: Turn[] = ['left', 'straight', 'right']
    let index = values.indexOf(turn)
    return values[(index + 1) % values.length]
  }

  const point2string = (p: Point): string => p[1] + ',' + p[0]

  const move = (world: World<string>, cart: Cart) => {
    let newTrack
    if (cart.direction === '^') {
      cart.location = [cart.location[0] - 1, cart.location[1]]
      newTrack = world[cart.location[0]][cart.location[1]]
      if (newTrack === '+') {
        if (cart.nextTurn === 'left') cart.direction = '<'
        if (cart.nextTurn === 'right') cart.direction = '>'
        cart.nextTurn = getNextTurn(cart.nextTurn)
      }
      if (newTrack === '/') {
        cart.direction = '>'
      }
      if (newTrack === '\\') {
        cart.direction = '<'
      }
    } else if (cart.direction === 'v') {
      cart.location = [cart.location[0] + 1, cart.location[1]]
      newTrack = world[cart.location[0]][cart.location[1]]
      if (newTrack === '+') {
        if (cart.nextTurn === 'left') cart.direction = '>'
        if (cart.nextTurn === 'right') cart.direction = '<'
        cart.nextTurn = getNextTurn(cart.nextTurn)
      }
      if (newTrack === '/') {
        cart.direction = '<'
      }
      if (newTrack === '\\') {
        cart.direction = '>'
      }
    } else if (cart.direction === '<') {
      cart.location = [cart.location[0], cart.location[1] - 1]
      newTrack = world[cart.location[0]][cart.location[1]]
      if (newTrack === '+') {
        if (cart.nextTurn === 'left') cart.direction = 'v'
        if (cart.nextTurn === 'right') cart.direction = '^'
        cart.nextTurn = getNextTurn(cart.nextTurn)
      }
      if (newTrack === '/') {
        cart.direction = 'v'
      }
      if (newTrack === '\\') {
        cart.direction = '^'
      }
    } else if (cart.direction === '>') {
      cart.location = [cart.location[0], cart.location[1] + 1]
      newTrack = world[cart.location[0]][cart.location[1]]
      if (newTrack === '+') {
        if (cart.nextTurn === 'left') cart.direction = '^'
        if (cart.nextTurn === 'right') cart.direction = 'v'
        cart.nextTurn = getNextTurn(cart.nextTurn)
      }
      if (newTrack === '/') {
        cart.direction = '^'
      }
      if (newTrack === '\\') {
        cart.direction = 'v'
      }
    }
    if (newTrack === ' ') throw new Error(JSON.stringify(cart))
  }

  const solveFor = (world: World<string>, carts: Cart[]): string => {
    let colisionPoint: string | undefined = undefined
    let cartLocations: Record<string, number> = {}
    carts.forEach((cart) => (cartLocations[point2string(cart.location)] = cart.id))
    while (!colisionPoint) {
      carts.forEach((cart) => {
        delete cartLocations[point2string(cart.location)]
        move(world, cart)
        let newLocation = point2string(cart.location)
        if (cartLocations[newLocation] !== undefined) colisionPoint = newLocation
        else cartLocations[newLocation] = cart.id
      })
    }
    return colisionPoint
  }

  const solveForPart2 = (world: World<string>, carts: Cart[]): string => {
    let cartLocations: Record<string, number[]> = {}
    carts.forEach((cart) => (cartLocations[point2string(cart.location)] = [cart.id]))
    let answer = undefined
    while (!answer) {
      log.debug(
        'carts',
        carts.map((c) => c.id)
      )
      log.debug('cartLocations', JSON.stringify(cartLocations))
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].active) {
          let oldLocation = point2string(carts[i].location)
          cartLocations[oldLocation] = cartLocations[oldLocation].filter((c) => c !== carts[i].id)
          if (cartLocations[oldLocation].length === 0) delete cartLocations[oldLocation]
          move(world, carts[i])
          let newLocation = point2string(carts[i].location)
          if (!cartLocations[newLocation]) cartLocations[newLocation] = []
          cartLocations[newLocation].push(carts[i].id)
          if (cartLocations[newLocation].length > 1) {
            log.debug('colision at ', newLocation, cartLocations[newLocation])
            cartLocations[newLocation].forEach((indexToDelete) => {
              let indexInArray = carts.findIndex((c: Cart) => c.id === indexToDelete)
              if (indexInArray >= 0) {
                carts[indexInArray].active = false
                let location = point2string(carts[indexInArray].location)
                cartLocations[location] = cartLocations[location].filter((c) => c !== carts[indexInArray].id)
                if (cartLocations[location].length === 0) delete cartLocations[location]
              }
            })
            /* let newCarts = carts.filter(c => c.active)
             if (newCarts.length === 1) {
               console.log('got winner', newCarts[0].id, point2string(newCarts[0].location))
               answer = point2string(newCarts[0].location)
             }*/
          }
        }
      }
      carts = carts.filter((c) => c.active)
      if (carts.length === 1) {
        log.debug('got winner', carts[0].id, point2string(carts[0].location))
        answer = point2string(carts[0].location)
      }
    }
    // @ts-ignore
    return answer
  }

  if (!params.skipPart1) {
    part1 = solveFor(world, carts)
  }
  if (!params.skipPart2) {
    part2 = solveForPart2(world, carts)
  }

  return { part1, part2 }
}
