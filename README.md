# How to run

## makePuzzle

    ts-node makePuzzle {year} {day}

## runPuzzle

    ts-node runPuzzle {year} {day}

or 

    ts-node src/{year}/{day}

# Puzzle options options: 

* year: string, mandatory => chooses the year 
* day: string, mandatory => chooses the day 
* logLevel ?: string => sets log level (info, debug, etc) default: info
* mode => if there is another solution (fastest, easiest, etc) default: normal 
* ui ?: boolean => turns on UI. default: { show: false }
** show?: boolean => how or not the UI
** end?: boolean
** during?: boolean
** wait:?: number
* test ?: Test | Array<Test> => runs tests
* prod ?: Prod => runs final.  


## Test

id: test id, tied to the test input file name
skip ?: boolean | 'part1' | 'part2'
params ?: any => additional params
answers ?: any => object with part1 and/or part2 answers

## Prod

skip ?: boolean | 'part1' | 'part2'
params ?: any => additional params
answers ?: any => object with part1 and/or part2 answers

## skip

skip === true => skip both parts
skip === 'part1' => skip only part1
skip === 'part2' => skip only part2

# Recommendations

functions: solveFor, DFS, BFS
types: use World: World
Avoid lodash
use  global.structuredClone instead of deepClone, or {...obj} / arr.slice() for shallows

prefer match with /g than matchAll, as in 

"abcabfgabsefd".match(/ab/) => ['ab', index: 0, input: 'abcabfgabsefd', groups: undefined]
"abcabfgabsefd".match(/ab/g) => ['ab', 'ab', 'ab']
"123123123".match(/ab/) => null