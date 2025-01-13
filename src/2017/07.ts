import { Params } from 'aoc.d'

type Disc = {
  atBase: boolean
  weight: number
  children?: string[]
}
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: number = 0

  let tower: Record<string, Disc> = {}

  const getWeight = (key: string): number =>
    tower[key].weight + (tower[key].children?.map(getWeight)?.reduce((a, b) => a + b) ?? 0)

  const findUnstableDisc = (disc: Disc, diff: number): number => {
    let weights: number[] = disc?.children?.map(getWeight) ?? []
    let minWeight = Math.min(...weights)
    let maxWeight = Math.max(...weights)
    if (minWeight === maxWeight) return disc.weight + diff

    let countMinWeight = weights.filter((weight) => weight === minWeight)
    let countMaxWeight = weights.filter((weight) => weight === maxWeight)
    let oddWeight = countMaxWeight.length === 1 ? countMaxWeight[0] : countMinWeight[0]
    let referenceWeight = countMaxWeight.length === 1 ? countMinWeight[0] : countMaxWeight[0]
    let diffWeight = referenceWeight - oddWeight

    let oddWeightIndex = weights.indexOf(oddWeight)
    let newName = disc.children?.[oddWeightIndex]

    return findUnstableDisc(tower[newName!], diffWeight)
  }

  for await (const line of lineReader) {
    const [, name, weight, more, children] = line.match(/(.+) \((\d+)\)( -> )?(.*)?/)
    if (!tower[name]) tower[name] = { atBase: true, weight: +weight }
    // already mentioned previously on a children
    else tower[name] = { ...tower[name], atBase: false, weight: +weight }
    if (more) {
      tower[name].children = []
      children.split(', ').forEach((disc: string) => {
        tower[name].children!.push(disc)
        // weight 0, as we still do not know it, will come in the future
        if (!tower[disc]) tower[disc] = { atBase: false, weight: 0 }
        else tower[disc] = { ...tower[disc], atBase: false }
      })
    }
  }

  part1 = Object.keys(tower).find((key) => tower[key].atBase)!

  part2 = findUnstableDisc(tower[part1!], 0)

  return { part1, part2 }
}
