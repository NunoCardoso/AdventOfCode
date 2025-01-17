import { magnitude, reduce, sum } from './18'

describe('2011/18', () => {
  test('sum with no reduce', () => {
    expect(sum(['[[[[4,3],4],4],[7,[[8,4],9]]]', '[1,1]'], false)).toEqual('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')
  })

  test('reduce', () => {
    expect(reduce('[[[[[9,8],1],2],3],4]')).toEqual('[[[[0,9],2],3],4]')
    expect(reduce('[7,[6,[5,[4,[3,2]]]]]')).toEqual('[7,[6,[5,[7,0]]]]')
    expect(reduce('[[6,[5,[4,[3,2]]]],1]')).toEqual('[[6,[5,[7,0]]],3]')
    expect(reduce('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]')).toEqual('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')
    expect(reduce('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')).toEqual('[[3,[2,[8,0]]],[9,[5,[7,0]]]]')
    expect(reduce('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')).toEqual('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]')
  })

  test('reduce 2', () => {
    expect(sum(['[[[[4,3],4],4],[7,[[8,4],9]]]', '[1,1]'], false)).toEqual('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')
    expect(reduce('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')).toEqual('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]')
    expect(reduce('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]')).toEqual('[[[[0,7],4],[15,[0,13]]],[1,1]]')
    expect(reduce('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')).toEqual('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')
  })
  test('sum2', () => {
    expect(sum(['[[[[4,3],4],4],[7,[[8,4],9]]]', '[1,1]'])).toEqual('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')
  })

  test('sum3', () => {
    expect(sum(['[1,1]', '[2,2]', '[3,3]', '[4,4]'])).toEqual('[[[[1,1],[2,2]],[3,3]],[4,4]]')
    expect(sum(['[1,1]', '[2,2]', '[3,3]', '[4,4]', '[5,5]'])).toEqual('[[[[3,0],[5,3]],[4,4]],[5,5]]')
    expect(sum(['[1,1]', '[2,2]', '[3,3]', '[4,4]', '[5,5]', '[6,6]'])).toEqual('[[[[5,0],[7,4]],[5,5]],[6,6]]')
  })

  test('sum4', () => {
    expect(sum(['[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]', '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]'])).toEqual(
      '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]'
    )

    expect(
      sum(['[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]', '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]'])
    ).toEqual('[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]')

    expect(
      sum([
        '[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]',
        '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]'
      ])
    ).toEqual('[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]')

    expect(sum(['[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]', '[7,[5,[[3,8],[1,4]]]]'])).toEqual(
      '[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]'
    )

    expect(sum(['[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]', '[[2,[2,2]],[8,[8,1]]]'])).toEqual(
      '[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]'
    )

    expect(sum(['[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]', '[2,9]'])).toEqual(
      '[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]'
    )

    expect(sum(['[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]', '[1,[[[9,3],9],[[9,0],[0,7]]]]'])).toEqual(
      '[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]'
    )

    expect(sum(['[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]', '[[[5,[7,4]],7],1]'])).toEqual(
      '[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]'
    )

    expect(sum(['[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]', '[[[[4,2],2],6],[8,7]]'])).toEqual(
      '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]'
    )

    expect(
      sum([
        '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]',
        '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]',
        '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]',
        '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]',
        '[7,[5,[[3,8],[1,4]]]]',
        '[[2,[2,2]],[8,[8,1]]]',
        '[2,9]',
        '[1,[[[9,3],9],[[9,0],[0,7]]]]',
        '[[[5,[7,4]],7],1]',
        '[[[[4,2],2],6],[8,7]]))'
      ])
    ).toEqual('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')
  })

  it('magnitude', () => {
    expect(magnitude('[[1,2],[[3,4],5]]')).toEqual(143)
    expect(magnitude('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')).toEqual(1384)
    expect(magnitude('[[[[1,1],[2,2]],[3,3]],[4,4]]')).toEqual(445)
    expect(magnitude('[[[[3,0],[5,3]],[4,4]],[5,5]]')).toEqual(791)
    expect(magnitude('[[[[5,0],[7,4]],[5,5]],[6,6]]')).toEqual(1137)
    expect(magnitude('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')).toEqual(3488)
  })
})
