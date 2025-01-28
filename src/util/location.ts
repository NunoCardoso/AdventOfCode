import { Location, LocationPlus } from '../declarations.d'

export const isSame = (l1: Location, l2: Location) => l1[0] === l2[0] && l1[1] === l2[1]

export const fromKey = (s: string): Location => s.split(',').map(Number) as Location

export const getKey = (l: Location | LocationPlus<any>): string => l[0] + ',' + l[1]

export const getManhattanDistance = (l1: Location, l2: Location): number =>
  Math.abs(l2[0] - l1[0]) + Math.abs(l2[1] - l1[1])

export const getGeometricDistance = (l1: Location, l2: Location): number =>
  Math.sqrt((l1[0] - l2[0]) * (l1[0] - l2[0]) + (l1[1] - l2[1]) * (l1[1] - l2[1]))
