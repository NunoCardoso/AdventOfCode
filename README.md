# Advent of Code - puzzle solutions

This is my repo with code solutions for the amazing [Advent of Code](https://adventofcode.com/) challenge.

All code is written in TypeScript. 

Note that you can't run the programs, because the input files are missing.  
The Advent of Code owner asked participants to not republish them, as they are copyrighted by him. It is his
work, so he decides that and we should comply. 

So, if you want to run the puzzles, you need to download the input files yourself, and put then in the `input` 
directory, like this:

    ./input/2015/01.input.txt
    ./input/2015/02.input.txt
    ./input/2015/02.test1.txt


# Setup/install/run

Clone this repo, then do:

    npm install

To make a puzzle template for a new day:

    npm run makeDay {year} {day}

To run a puzzle program, do:

    npm run day {year} {day}

To run the whole year of puzzles:

    npm run year {year}

Reports will be pushed into the `report` directory.

# Puzzle status

| year | result       | status     | speed                                   | code    | comment                                                 | report                   |
|------|--------------|------------|-----------------------------------------|---------|---------------------------------------------------------|--------------------------|
| 2015 | ✅ FINISHED   | ✅ SOLVED   | all (but md) run under 1 second | cleaned | linted, cleaned                                                 | reports/2015.md          |
| 2016 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | stuck on 22 (hard disk move), linted, cleaned           | reports/2016.md          |
| 2017 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | In progress, ongoing on 20                              | reports/2017.md          |
| 2018 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | In progress, ongoing on 14                              | reports/2018.md          |
| 2019 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | TO DO                                                   | reports/2019.md          |
| 2020 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | TO DO                                                   | reports/2020.md          |
| 2021 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | In progress, ongoing on 20                              | reports/2021.md          |
| 2022 | ❌ UNFINISHED | ✅ SOLVED   | ?                                       |         | Unoptimized, Needs fix after 16                         | reports/2022.md          |
| 2023 | ❌ UNFINISHED | ❌ UNSOLVED |                                         |         | Unoptimized, needs to do last puzzles                   | reports/2023.md          |
| 2024 | ❌ UNFINISHED | ✅ SOLVED   | ?                                       |         | 24 solved manually, code still needs clean and optimized | reports/2024.md          |

# Puzzle options options: 

| key               | type                                      | description                                                                              |
|-------------------|-------------------------------------------|------------------------------------------------------------------------------------------|
| config.title      | string, optional                          | puzzle title                                                                             |
| config.summary    | string, optional                          | puzzle summary, to follow up the story                                                   |
| config.comment    | string, optional                          | puzzle comments on how I did with it                                                     |
| config.result     | 'finished', 'unfinished'                  | puzzle result: finished means solved, fast AND clean                                     |
| config.status     | 'solved', 'unsolved'                      | puzzle status                                                                            |
| config.speed      | 'unknown', 'slow', 'medium', fast', 'md5' | puzzle speed  (md5 is brute force that can't go faster)                                  |
| config.code       | 'clean', 'dirty'                          | puzzle code: clean means linted and formatted                                            |
| config.difficulty | 1-5                                       | puzzle difficulty: 1 solves in minutes, 4 means at least 1 day, 5 means more than 2 days |
| config.tags       | string[]?,                                | puzzle tags (see below)                                                                  |
| config.year       | string, mandatory                         | puzzle year                                                                              | 
| config.day        | string, mandatory                         | puzzle day                                                                               |
| logLevel          | info, debug, warn, error                  | default: info                                                                            |
| mode              | string?                                   | if there is another solution (fastest, easiest, etc) default: normal                     |
| ui                | object                                    | UI stuff default: { show: false }                                                        |
| ui.show           | boolean                                   | show or not the UI                                                                       |
| ui.end            | boolean?                                  | show the UI in the end                                                                   |
| ui.during         | boolean?                                  | show the UI during iterations                                                            |
| ui.wait           | number?                                   | wait for X milliseconds between iterations                                               |
| ui.keypress       | boolean?                                  | wait for keypress                                                                        |
| test              | Test?, Test[]?                            | runs tests                                                                               |
| test.id           | string                                    | tied to the test input file name                                                         |
| test.params       | any                                       | additional params: can be whatever                                                       |
| test.answers      | any                                       | object with part1 and/or part2 answers. It decides if parts should run or be skipped.    |
| prod              | Prod?                                     | runs final                                                                               |
| prod.params       | any                                       | additional params                                                                        |
| prod.answers      | any                                       | object with part1 and/or part2 answers. It decides if parts should run or be skipped.    |
| params            | any                                       | params                                                                                   |

List of tags used: 

* Dijkstra
* Recursion
* A*
* Permutation
* MD5
* Combination
* Breath-first
* Depth-first
* Path-finding
* Bron–Kerbosch
* Regex

# Coding guidelines v1.0

* Typescript
* Aim for less than 1 second to solve both day puzzles 
* Focus on readability. Code should be easy to follow with declarative functions
* Move away from structures like [number, number, number, string], they are fast but not easy to follow in code.
* after solution is done, I can remove the partial part codes. Solutions should run both parts in one go. 

## Typing
* do type everything. Avoid `any` type. 
* avoid global.structureClone, it is very slow
* Reuse types such as `Location`, `Dimension`, `World`, they help.
* use [] instead of `Array`.
* If possible, avoid `Record` and use `Map`. `Set` are also useful sometimes instead of `Array`
** for increments, try map.set("a", (map.get("a") ?? 0) + 1)
** prefer reduce for sums 
* Prefer `Location` to `Point`. `Location` implies coordinates, `Point` is something that has location but also extra stuff
* Prefer For...Of and For...in then forEach: 
** For... of loops over the Values
** For...in: Loops over the Keys.
** We can use break and continue (forEach we can't)
** we do not need to have the array ready for iteration (permutations and stuff)

## Coding names
* Be as declarative as possible, use function names to describe the steps
Some functions names: `solveFor`, `deepFirst`, `breathFirst`, `dijkstra`

## Coding style
* try to separate part1 and part2, while avoiding unnecessary array walks for each part. 

## Dependencies
* **Avoid** lodash, use native JS 
* libraries allowed:
** spark-mp5 (md5 generation)

## Regex
* Prefer match with /g than matchAll, as in

      "abcabfgabsefd".match(/ab/) => ['ab', index: 0, input: 'abcabfgabsefd', groups: undefined]
      "abcabfgabsefd".match(/ab/g) => ['ab', 'ab', 'ab']
      "123123123".match(/ab/) => null

* find duplicate characters: line.match(/(.)\1/g)

## Path finding

* use pop() instead of splice(-1)[0]
* terminology: 
** step: a node with extra info (location, distance/score, etc) 
** path: list of steps. 
** head: latest step from a path
** queue instead of opened 
** visited

## TODO 
* do a nicer output with emojis and box drawing chars

# Algorithms Overview

## Path finding algorithms

Table summary: 

| Name         | weighted graph | visits all paths? | guarantees shortest? | heuristics | comments                                         |
|--------------|----------------|-------------------|----------------------|------------|--------------------------------------------------|
| DFS          | no             | no                | no                   | no         | only if you want to find any path                |
| BFS          | no             | yes               | yes                  | no         | not for weighted graphs                          |
| Dijkstra     | yes            | yes               | yes                  | no         | can be slow on big graphs                        |
| A*           | yes            | yes               | yes                  | yes        | can be faster than Dijkstra if heuristic is good |
| Greedy       | -              | no                | no                   | yes        | not good as shortest is not guaranteed           |
| Bellman-Ford | yes, negatives | yes               | yes                  | no         | Dijkstra for weights with negative values        |
| UCS          | yes            | yes               | yes                  | no         | Dijkstra-ish                                     |

Floyd-Warshall

### Dijkstra’s Algorithm

* Dijkstra’s algorithm finds the shortest path from a start node to all other nodes in a weighted graph. 
* It explores all possible paths systematically, always expanding the least-cost node first, and guarantees the shortest path.
* It does not use heuristics, so it works on any graph but can be slow for large graphs.

### A* Algorithm

* A* improves upon Dijkstra’s algorithm by using a heuristic function to estimate the distance to the goal.
* It combines this estimate with the actual cost to the current node, allowing it to focus on promising paths. 
* This makes A* faster than Dijkstra’s for many problems, but its performance depends on the quality of the heuristic.

### Breadth-First Search (BFS)

* BFS explores all nodes at the current depth before moving to the next level. 
* It is unweighted and guarantees the shortest path in graphs where all edges have the same weight.
* It is NOT suitable for weighted graphs.

### Depth-First Search (DFS)

* DFS explores as far as possible along each path before backtracking. 
* It does not guarantee the shortest path and is not optimal for pathfinding but can be useful for exploring or checking graph connectivity.

### Greedy Best-First Search

* Greedy Best-First Search uses only the heuristic to choose which node to expand next. 
* It focuses on the direction of the goal but does not guarantee the shortest path and can get stuck in suboptimal routes.

### Bellman-Ford Algorithm

* Bellman-Ford finds the shortest path from a start node to all other nodes, even with negative edge weights.
* It is slower than Dijkstra’s but works in situations where Dijkstra’s cannot, such as graphs with negative weights.

### Floyd-Warshall Algorithm

* Floyd-Warshall calculates shortest paths between all pairs of nodes in a graph.
* It is suitable for small, dense graphs but is computationally expensive and not used for single-source pathfinding.

### Uniform-Cost Search (UCS)

* UCS is similar to Dijkstra’s algorithm but focuses only on finding the shortest path to a specific goal node.
* It expands the least-cost node first and guarantees the shortest path, making it optimal but slower than A* for large graphs.

# Guidelines

##  X or Y?  Rows and Columns?

* Row goes vertical (↓), col goes horizontal (→)
* X goes horizontal (→), Y goes vertical (↓) like the HTML pages

| []()                   |                        |                        |                        |
|------------------------|------------------------|------------------------|------------------------|
| row 0, col 0, x 0, y 0 | row 0, col 1, x 1, y 0 | row 0, col 2, x 2, y 0 | row 0, col 3, x 3, y 0 |
| row 1, col 0, x 0, y 1 | row 1, col 1, x 1, y 1 | row 1, col 2, x 2, y 1 | row 1, col 3, x 3, y 1 |
| row 2, col 0, x 0, y 2 | row 2, col 1, x 1, y 2 | row 2, col 2, x 2, y 2 | row 2, col 3, x 3, y 2 |
| row 3, col 0, x 0, y 3 | row 3, col 1, x 1, y 3 | row 3, col 2, x 2, y 3 | row 3, col 3, x 3, y 3 |

If it is confusing, use PointObj, where {row: number, col: number}

unless it is specified otherwise in the instructions.
Note that when printing worlds, world matrix are seen as rows and columns, so make sure locations 
use same system. If they use x/y, they may refer to col/row instead of row/col

# Appendixes

For box drawing (https://en.wikipedia.org/wiki/Box-drawing_characters):

 | 0      |1|	2|	3|	4|	5|	6|	7|	8|	9|	A|	B|	C|	D|	E|	F|
 |--------|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
 | U+250x |	─|	━|	│|	┃|	┄|	┅|	┆|	┇|	┈|	┉|	┊|	┋|	┌|	┍|	┎|	┏|
 | U+251x |	┐|	┑|	┒|	┓|	└|	┕|	┖|	┗|	┘|	┙|	┚|	┛|	├|	┝|	┞|	┟|
 | U+252x |	┠|	┡|	┢|	┣|	┤|	┥|	┦|	┧|	┨|	┩|	┪|	┫|	┬|	┭|	┮|	┯|
 | U+253x |	┰|	┱|	┲|	┳|	┴|	┵|	┶|	┷|	┸|	┹|	┺|	┻|	┼|	┽|	┾|	┿|
 | U+254x |	╀|	╁|	╂|	╃|	╄|	╅|	╆|	╇|	╈|	╉|	╊|	╋|	╌|	╍|	╎|	╏|
 | U+255x |	═|	║|	╒|	╓|	╔|	╕|	╖|	╗|	╘|	╙|	╚|	╛|	╜|	╝|	╞|	╟|
 | U+256x |	╠|	╡|	╢|	╣|	╤|	╥|	╦|	╧|	╨|	╩|	╪|	╫|	╬|	╭|	╮|	╯|
 | U+257x |	╰|	╱|	╲|	╳|	╴|	╵|	╶|	╷|	╸|	╹|	╺|	╻|	╼|	╽|	╾|	╿|


# IDEAS 
 
* make output on report like a book, optional solve
* title and summary to XX.readme.md
* FUNNY STORY BITS in XX.readme.md


