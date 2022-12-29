import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  type Recipe = {
    capacity: number
    durability: number
    flavor: number
    texture: number
    calories: number
  }
  type Amount = Record<string, number>

  type RecipeMap = Record<string, Recipe>

  let part1: number = 0; let part2: number = 0
  const recipeMap: RecipeMap = {}
  for await (const line of lineReader) {
    const m = line.match(/^(.*): capacity (.*), durability (.*), flavor (.*), texture (.*), calories (.*)$/)
    recipeMap[m[1]] = {
      capacity: parseInt(m[2]),
      durability: parseInt(m[3]),
      flavor: parseInt(m[4]),
      texture: parseInt(m[5]),
      calories: parseInt(m[6])
    }
  }

  const calculateIngredient = (amount: number, pleasureness: number) => {
    return amount * pleasureness
  }

  const calculateBalance = (amount: Amount, recipeMap: RecipeMap, calorieTarget: undefined | number) => {
    const res: Record<string, number> = {
      capacity: 0, durability: 0, flavor: 0, texture: 0
    }
    let calories: number = 0
    Object.keys(amount).forEach((ingredient) => {
      res.capacity += calculateIngredient(amount[ingredient], recipeMap[ingredient].capacity)
      res.durability += calculateIngredient(amount[ingredient], recipeMap[ingredient].durability)
      res.flavor += calculateIngredient(amount[ingredient], recipeMap[ingredient].flavor)
      res.texture += calculateIngredient(amount[ingredient], recipeMap[ingredient].texture)
      if (calorieTarget !== undefined) {
        calories += calculateIngredient(amount[ingredient], recipeMap[ingredient].calories)
      }
    })
    if (calorieTarget !== undefined) {
      if (calories !== calorieTarget) {
        return 0
      }
    }
    return _.reduce(Object.keys(res), (memo: number, val: string) => (
      memo * (res[val] < 0 ? 0 : res[val])
    ), 1)
  }

  const doIterations = (iterators: Array<number>, remaining: number, portions: Array<number>, calorieTarget: undefined | number) => {
    let res = 0
    if (iterators.length > 0) {
      for (let i = iterators[0]; i <= remaining; i++) {
        const _res = doIterations(iterators.slice(1, iterators.length), remaining - i, portions.concat(i), calorieTarget)
        if (_res > res) {
          res = _res
        }
      }
    } else {
      const amounts: Amount = {}
      Object.keys(recipeMap).forEach((recipe, index) => {
        amounts[recipe] = portions[index]
      })
      // log.debug('trying', amounts)
      return calculateBalance(amounts, recipeMap, calorieTarget)
    }
    return res
  }

  const iterators: Array<number> = new Array(Object.keys(recipeMap).length).fill(0)

  part1 = doIterations(iterators, 100, [], params.part1.calories)
  part2 = doIterations(iterators, 100, [], params.part2.calories)

  return { part1, part2 }
}
