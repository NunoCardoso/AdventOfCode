# Advent of Code puzzle solutions

These are my solutions for the amazing [Advent of Code](https://adventofcode.com/) challenge, written in TypeScript. 

Note that you can't run the programs, as the input files are missing. They are missing from this repo because the 
Advent of Code owner asked that, as they are created by him, and as such, he has a saying on that.

So, if you want to run this, you have to get the files yourself, and put then in the input directory, with this format:

    ./input/2015/01.input.txt
    ./input/2015/02.input.txt
    ./input/2015/02.test1.txt

# Setup/install

You should do a simple

    npm install 

after cloning this, and you should be fine.

# Run

## Create a puzzle template

    npm run makeDay {year} {day}

Note: if it is a new year, create the year directory under `src` and `input` directories first.

## Run a puzzle program

    npm run day {year} {day}

## run a whole year of puzzles

    npm run year {year}

Reports will be pushed into the `report` directory.

# Puzzle options options: 
| key               | type                 | description                                                          |
|-------------------|----------------------|----------------------------------------------------------------------|
| config.title      | string, optional     | puzzle title                                                         |
| config.comment    | string, optional     | puzzle comments                                                      |
| config.status     | 'done', 'inprogress' | puzzle status                                                        |
| config.difficulty | 1 to 5               | puzzle difficulty                                                    |
| config.tags       | string[], optional   | puzzle tags (recursive, pathfinding, md5, etc)                       |
| config.year       | string, mandatory    | chooses the year                                                     | 
| config.day        | string, mandatory    | chooses the day                                                      |
| logLevel          | string               | sets log level (info, debug, etc) default: info                      |
| mode              | string?              | if there is another solution (fastest, easiest, etc) default: normal |
| ui                | object               | UI stuff default: { show: false }                                    |
| ui.show           | boolean              | how or not the UI                                                    |
| ui.end            | boolean?             |                                                                      |
| ui.during         | boolean?             |                                                                      |
| ui.wait:          | number?              |                                                                      |
| ui.keypress       | boolean?             |                                                                      |
| test              | Test?, Test[]?       | runs tests |
| test.id           | string | tied to the test input file name |
| test.params       | any | additional params |
| test.answers      | any | object with part1 and/or part2 answers. It decides if parts should run or be skipped. |
| prod              |  Prod? | runs final |
| prod.params       | any | additional params |
| prod.answers      | any | object with part1 and/or part2 answers. It decides if parts should run or be skipped. |
| params            | any | params |

# Status

| year | status      | comment |
|------|-------------|---------|
| 2015 | DONE        | Optimized, all but a couple under 1 second which can't run faster |
| 2016 | IN PROGRESS | stuck on 22 (hard disk move)  |
| 2017 | IN PROGRESS | ongoing on 20 |
| 2018 | IN PROGRESS | ongoing on 14 |
| 2019 | TODO        | |
| 2020 | TODO        | |
| 2021 | IN PROGRESS | ongoing on 20 |
| 2022 | DONE        | Unoptimized, Needs fix after 16 |
| 2023 | ALMOST DONE | Unoptimized, needs cleaning, do last puzzles |
| 2024 | ONGOING | |

# Guidelines

## Typing
* do type everything. Avoid `any` type. reuse types such as `Point`, `Dimension`, `World`, they help.
* If possible, avoid `Record` and use `Map`. `Set` are also useful sometimes instead of `Array`

## Coding names
* Be as declarative as possible, use function names to describe the steps
Some functions names: `solveFor`, `deepFirst`, `breathFirst`, `dijkstra`

## Coding style
* try to separate part1 and part2, while avoiding unnecessary array walks for each part. 

## Dependencies
* Avoid lodash, use native JS 
* libraries allowed: 
** js-combinatronics (for permutation / combination)
** spark-mp5 (md5 generation)

## Regex
* Prefer match with /g than matchAll, as in

      "abcabfgabsefd".match(/ab/) => ['ab', index: 0, input: 'abcabfgabsefd', groups: undefined]
      "abcabfgabsefd".match(/ab/g) => ['ab', 'ab', 'ab']
      "123123123".match(/ab/) => null
