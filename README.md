# Setup

all inputs and tests should be in a input directory, as in:

    ./input/2015/01.input.txt
    ./input/2015/02.input.txt
    ./input/2015/02.test1.txt

This is because adventofcode author asks people to not commit puzzle inputs. 

# How to run

## makeDay

to create a puzzle template 

    npm run makeDay {year} {day}

(if it is a new year, create year dirs on src and input first)

## runDay

to run a puzzle

    npm run day {year} {day}

## runYear

to run a batch of puzzles

    npm run year {year}

# Puzzle options options: 
* title: string, optional => puzzle title
* comment: string, optional => puzzle comments
* status: 'done', 'inprogress'
* difficulty: 1 to 5
* tags: string, optional => puzzle tags (recursive, pathfinding, md5, etc)
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
** id: test id, tied to the test input fil[todo](todo)e name
** params ?: any => additional params
** answers ?: any => object with part1 and/or part2 answers. It decides if parts should run or be skipped.
* prod ?: Prod => runs final.  
** params ?: any => additional params
** answers ?: any => object with part1 and/or part2 answers. It decides if parts should run or be skipped.

## skip

Skip is now being defined with the presence of answer.partX or not.

# Guidelines

. Functions names: solveFor, deepFirst, breathFirst, dijkstra
. Be as declarative as possible, use function names to describe the steps

## Typing
. use Point, Dimension, World 
. avoid the any type[aoc.d.ts](src%2Faoc.d.ts)
. replace Record with Sets, Maps

## Status

. 2015 DONE, OPTIMIZED
. 2016 IN PROGRESS,STUCK   22 (hard disk move)
. 2017 IN PROGRESS UNSTUCK 19
- 2018 IN PROGRESS STUCK   13 (carts)
- 2019 TODO
- 2020 TODO
- 2021 IN PROGRESS UNSTUCK 19
- 2022 DONE My first, Needs fix after 16
- 2023 DONE needs clear and optimize
- 2024 ONGOING 9

## Dependencies

. Avoid lodash, use native JS 
. libraries allowed: js-combinatronics (for permutation / combination), spark-mp5 (md5)
. prefer match with /g than matchAll, as in

"abcabfgabsefd".match(/ab/) => ['ab', index: 0, input: 'abcabfgabsefd', groups: undefined]
"abcabfgabsefd".match(/ab/g) => ['ab', 'ab', 'ab']
"123123123".match(/ab/) => null
