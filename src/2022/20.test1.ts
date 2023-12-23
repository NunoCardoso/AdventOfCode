const getNewIndex = (_oldIndex: number, _shiftHowMuch: number, _listLength: number) => {
  if (_shiftHowMuch === 0) {
    return _oldIndex
  }

  const modifiedShift = _shiftHowMuch % (_listLength - 1)
  let res = _oldIndex + modifiedShift
  if (_oldIndex + modifiedShift <= 0) {
    while (res <= 0) {
      res += _listLength
      if (res < _oldIndex + 2) {
        res -= 1
      }
    }
  } else if (_oldIndex + modifiedShift >= _listLength) {
    res = _oldIndex + modifiedShift
    while (res >= _listLength) {
      res -= _listLength
      res += 1
    }
    if (res > _oldIndex) {
      res += 1
    }
  } else if (_oldIndex + modifiedShift > 0 && _oldIndex + modifiedShift < _listLength) {
    if (res > _oldIndex) {
      res += 1
    }
  }
  return res
}
// (_oldIndex: number, _shiftHowMuch: number, _listLength: number) => {

//       [2,3,4,1,5,6,7]
// index: 0,1,2,3,4,5,6

// old index 2, shithowmuch 1 => new Index 4 => means [0,2][2, 2+1][2+1, 4][4, length]  =>  [0,2][2+1, 4][2, 2+1][4, lehgth]
// as in [0,2,1,3,4,5,6] => [0,2][1][3][4,5,6] => [0,2][3][1][4,5,6]

/*
3,0,1,2,4,5,6   0
0,3,1,2,4,5,6   1
0,1,3,2,4,5,6   2
0,1,2,3,4,5,6   3
0,1,2,4,3,5,6   4
0,1,2,4,5,3,6   5

3,0,1,2,4,5,6   6
 */

// insert: {0}0{1}1{2}2{3}3{4}4{5}5{6}6{7}
// insert at 1 x.splice(1,0,'a')
// remove at 1 x.splice(1,1)
console.log('1', getNewIndex(3, -22, 7), 6) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -21, 7), 7) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -20, 7), 1) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -19, 7), 2) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -18, 7), 3) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -17, 7), 5) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -16, 7), 6) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -15, 7), 7) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -14, 7), 1) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -13, 7), 2) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -12, 7), 3) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -11, 7), 5) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -10, 7), 6) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -9, 7), 7) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('1', getNewIndex(3, -8, 7), 1) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('2', getNewIndex(3, -7, 7), 2) // [2,3,4][insert]{1}[5,6,7] => //[2,3,4,1,5,6,7]
console.log('3', getNewIndex(3, -6, 7), 3) // [2,3,4]{1}[insert][5,6,7]//[2,3,4,5,1,6,7]
console.log('4', getNewIndex(3, -5, 7), 5) // [2,3,4,5,6,1,7]
console.log('5', getNewIndex(3, -4, 7), 6) // [2,3,4]{1}[5,6]{insert}[7] => [2,3,4,5,6,1,7]
console.log('6', getNewIndex(3, -3, 7), 7) // [2,3,4]{1}[5,6,7][insert], //[insert][2,3,4]{1}[5,6,7] => [2,3,4,5,6,7,1]
console.log('7', getNewIndex(3, -2, 7), 1) // [2][insert][3,4]{1}[5,6,7] =>  [2,1,3,4,5,6,7]
console.log('8', getNewIndex(3, -1, 7), 2) // [2,3][insert][4]{1}[5,6,7] =>  [2,3,1,4,5,6,7]

// newIndex > oldIndex => temp =x[oldindex], x.splice(newindex,0,temp), x.splice(oldindex, 1)
// newIndex < oldIndex => temp =x[oldindex], x.splice(oldindex, 1), x.splice(newindex,0,temp),
console.log('9', getNewIndex(3, 0, 7), 3) // [2,3,4,1,5,6,7]
console.log('10', getNewIndex(3, 1, 7), 5) // [2,3,4]{1}[5]{}[6,7] => [2,3,4,5,1,6,7]
console.log('11', getNewIndex(3, 2, 7), 6) // [2,3,4]{1}[5,6]{}[7] => [2,3,4,5,6,1,7]
console.log('12', getNewIndex(3, 3, 7), 7) // [2,3,4]{1}[5,6,7]{} => [2,3,4,5,6,7,1]
console.log('13', getNewIndex(3, 4, 7), 1) // [2]{}[3,4]{1}[5,6,7] => [2,1,3,4,5,6,7]
console.log('14', getNewIndex(3, 5, 7), 2) // [2,3]{}[4]{1}[5,6,7] => [2,3,1,4,5,6,7]
console.log('15', getNewIndex(3, 6, 7), 3) // [2,3,4]{1}[5,6,7] => [2,3,4,1,5,6,7]
console.log('16', getNewIndex(3, 7, 7), 5) // [2,3,4]{1}{}[5,6,7] => [2,3,4,1,5,6,7]
console.log('17', getNewIndex(3, 8, 7), 6) // [2,3,4]{1}[5]{insert}[6,7] => [2,3,4,5,1,6,7]
console.log('18', getNewIndex(3, 9, 7), 7)
console.log('19', getNewIndex(3, 10, 7), 1)
console.log('20', getNewIndex(3, 11, 7), 2)
console.log('20', getNewIndex(3, 12, 7), 3)
console.log('20', getNewIndex(3, 13, 7), 5)
console.log('20', getNewIndex(3, 14, 7), 6)
console.log('20', getNewIndex(3, 15, 7), 7)
console.log('20', getNewIndex(3, 16, 7), 1)
console.log('20', getNewIndex(3, 17, 7), 2)
console.log('20', getNewIndex(3, 18, 7), 3)
console.log('20', getNewIndex(3, 19, 7), 5)
console.log('20', getNewIndex(3, 20, 7), 6)
console.log('===')
// Initial arrangement:         1, 2, -3, 3, -2, 0, 4
// 1 moves between 2 and -3: {1}[2][][-3,3,-2,0,4]  2, 1, -3, 3, -2, 0, 4
console.log('x1', getNewIndex(0, 1, 7), 2)

// 2 moves between -3 and 3:  [2][1,-3][here is 3][ 3, -2, 0, 4]    1, -3, 2, 3, -2, 0, 4
console.log('x2', getNewIndex(0, 2, 7), 3)

// -3 moves between -2 and 0: [1][-3][2,3,-2][here is 5][0,4]   1, 2, 3, -2, -3, 0, 4
console.log('x3', getNewIndex(1, -3, 7), 5)

// 3 moves between 0 and 4: [1,2][3][-2,3,0][here is 6][4]  1, 2, -2, -3, 0, 3, 4
console.log('x4', getNewIndex(2, 3, 7), 6)

/*

-2 moves between 4 and 1:
1, 2, -3, 0, 3, 4, -2

0 does not move:
  1, 2, -3, 0, 3, 4, -2

4 moves between -3 and 0:
1, 2, -3, 4, 0, 3, -2
*/
