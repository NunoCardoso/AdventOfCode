import { Point } from 'declarations'

export const isSame = (p1: Point, p2: Point) => p1[0] === p2[0] && p1[1] === p2[1]

export const fromKey = (s: string): Point => s.split(',').map(Number) as Point

export const getKey = (p: Point): string => p[0] + ',' + p[1]

export const getManhattanDistance = (p1: Point, p2: Point) => Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1])
