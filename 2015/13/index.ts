import { Params } from 'aoc.d'
import _ from 'lodash'
import { permutation } from '../../utils'

type Peoples = Array<string>
type Scores = Record<string, any>

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const scores1: Scores = {}
  const people1: Peoples = []
  const people2: Peoples = []

  for await (const line of lineReader) {
    const vals = line.split(' ')
    const subj1: string = vals[0]
    const oper: string = vals[2]
    const value: number = parseInt(vals[3])
    const subj2: string = vals[vals.length - 1].replaceAll(/\./g, '')

    if (people1.indexOf(subj1) < 0) {
      people1.push(subj1)
      people2.push(subj1)
      scores1[subj1] = {}
    }
    if (people1.indexOf(subj2) < 0) {
      people1.push(subj2)
      people2.push(subj2)
      scores1[subj2] = {}
    }
    scores1[subj1][subj2] = value * (oper === 'lose' ? -1 : 1)
  }

  const getHighScore = (permutes: Array<Peoples>, scores: Scores): number => {
    let highScore = 0
    permutes.forEach((permute) => {
      let score = 0
      for (let i = 0; i < permute.length; i++) {
        const pers1 = i
        const pers2 = i + 1 === permute.length ? 0 : i + 1
        score += scores[permute[pers1]][permute[pers2]] + scores[permute[pers2]][permute[pers1]]
      }
      if (score > highScore) {
        highScore = score
      }
    })
    return highScore
  }

  people2.push(params.name)
  const scores2: Scores = _.cloneDeep(scores1)

  scores2[params.name] = {}
  people1.forEach((name: string) => {
    scores2[name][params.name] = 0
    scores2[params.name][name] = 0
  })

  if (params.part1?.skip !== true) {
    const permutes1 = permutation(people1)
    part1 = getHighScore(permutes1, scores1)
  }

  if (params.part2?.skip !== true) {
    const permutes2 = permutation(people2)
    part2 = getHighScore(permutes2, scores2)
  }

  return { part1, part2 }
}
