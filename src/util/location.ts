import { Location, LocationPlus } from '../declarations.d'

export const isSame = (l1: Location, l2: Location) => l1[0] === l2[0] && l1[1] === l2[1]

export const fromKey = (s: string): Location => s.split(',').map(Number) as Location

export const getKey = (l: Location | LocationPlus): string => l[0] + ',' + l[1]

export const getManhattanDistance = (l1: Location, l2: Location) => Math.abs(l2[0] - l1[0]) + Math.abs(l2[1] - l1[1])
