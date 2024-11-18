import { Params } from 'aoc.d'

type Entry = {
  pos: number
  weight: number
  children?: Array<string>

}
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string | undefined
  let part2: number = 0

  let data: Record<string, Entry> = {}

  for await (const line of lineReader) {
    const [, name, weight, more, others] = line.match(/(.+) \((\d+)\)( -> )?(.*)?/)
    if (!data[name]) data[name] = {pos: 1, weight: +weight}
    else data[name] = {...data[name], pos: data[name]!.pos + 1, weight: +weight }
    if (more) {
      let children: Array<string> = []
      others.split(', ').forEach((otherName: string) => {
        children.push(otherName)
        if (!data[otherName]) data[otherName] = {pos: -1, weight: 0}
        else data[otherName] = {...data[otherName], pos: data[otherName].pos - 1}
      })

      data[name].children = children
    }
  }

  const getWeight = (key: string): number => {
    let entry = data[key]
    return entry.weight! + (entry.children?.map(getWeight)?.reduce((acc, val) => acc + val, 0) ?? 0)
  }

  const findUnstableDisc = (e: Entry, diff: number): number => {

    let weights = e.children?.map(getWeight) ?? []
    let minWeight = Math.min(...weights)
    let maxWeight = Math.max(...weights)

    if (minWeight === maxWeight) return e.weight + diff

    let countMinWeight = weights.filter((w) => w === minWeight)
    let countMaxWeight = weights.filter((w) => w === maxWeight)
    let oddWeight = countMaxWeight.length === 1 ? countMaxWeight[0] : countMinWeight[0]
    let referenceWeight = countMaxWeight.length === 1 ? countMinWeight[0] : countMaxWeight[0]
    let diffWeight = referenceWeight - oddWeight

    let oddWeightIndex = weights.indexOf(oddWeight)
    let newName = e.children?.[oddWeightIndex]

    return findUnstableDisc(data[newName!], diffWeight)
  }

  // the root name is the only one who has a value of 1, as I am adding -1 for having parent,
  // +1 for having children. I am doing like this because I don't control when a node is mentioned first,
  // as a node or as a children
  //console.log(names)
  part1 = Object.keys(data).find((key) => data[key].pos === 1)

  part2 = findUnstableDisc(data[part1!], 0)

  return { part1, part2 }
}
