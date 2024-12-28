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

| year | status      | comment                                            | report          |
|------|-------------|----------------------------------------------------|-----------------|
| 2015 | SOLVED      | Optimized, all (but md5) run under 1 second | reports/2015.md |
| 2016 | IN PROGRESS | stuck on 22 (hard disk move)                       | reports/2016.md |
| 2017 | IN PROGRESS | ongoing on 20                                      | reports/2017.md |
| 2018 | IN PROGRESS | ongoing on 14                                      | reports/2018.md |
| 2019 | TODO        |                                                    | reports/2019.md |
| 2020 | TODO        |                                                    | reports/2020.md |
| 2021 | IN PROGRESS | ongoing on 20                                      | reports/2021.md |
| 2022 | ALMOST DONE | Unoptimized, Needs fix after 16                    | reports/2022.md |
| 2023 | ALMOST DONE | Unoptimized, needs cleaning, do last puzzles       | reports/2023.md |
| 2024 | ALMOST DONE | 17 and 24                                          | reports/2024.md |

# Puzzle options options: 
| key               | type                 | description                                                                           |
|-------------------|----------------------|---------------------------------------------------------------------------------------|
| config.title      | string, optional     | puzzle title                                                                          |
| config.comment    | string, optional     | puzzle comments                                                                       |
| config.status     | 'done', 'inprogress' | puzzle status                                                                         |
| config.difficulty | 1 to 5               | puzzle difficulty                                                                     |
| config.tags       | string[], optional   | puzzle tags (recursive, pathfinding, md5, etc)                                        |
| config.year       | string, mandatory    | chooses the year                                                                      | 
| config.day        | string, mandatory    | chooses the day                                                                       |
| logLevel          | string               | sets log level (info, debug, etc) default: info                                       |
| mode              | string?              | if there is another solution (fastest, easiest, etc) default: normal                  |
| ui                | object               | UI stuff default: { show: false }                                                     |
| ui.show           | boolean              | show or not the UI                                                                    |
| ui.end            | boolean?             | show the UI in he end                                                                 |
| ui.during         | boolean?             | show the UI in iterations                                                             |
| ui.wait:          | number?              | wait for X milliseconds between iterations                                            |
| ui.keypress       | boolean?             | wait for keypress                                                                           |
| test              | Test?, Test[]?       | runs tests                                                                            |
| test.id           | string | tied to the test input file name                                                      |
| test.params       | any | additional params                                                                     |
| test.answers      | any | object with part1 and/or part2 answers. It decides if parts should run or be skipped. |
| prod              |  Prod? | runs final                                                                            |
| prod.params       | any | additional params                                                                     |
| prod.answers      | any | object with part1 and/or part2 answers. It decides if parts should run or be skipped. |
| params            | any | params                                                                                |

List of tags used: 

* dijkstra
* recursion
* a*
* permutation
* md5
* combination
* breath first
* path finding
* Bron–Kerbosch

Proposal for: 
* STATUS: unsolved, solved
* SPEED: slow, fast, brute-force (for md5s)
* CODE: clean (optimized + formatted), dirty (unoptimized nor formatted)

# Coding guidelines

* Aim for <1s speed optimized
* Aim for readability, so code should be easy to follow - be declarative, use functions
* move away from structures like [number, number, number, string], they are fast but not readable

## Typing
* do type everything. Avoid `any` type. reuse types such as `Point`, `Dimension`, `World`, they help.
* If possible, avoid `Record` and use `Map`. `Set` are also useful sometimes instead of `Array`
** for increments, try map.set("a", (map.get("a") ?? 0) + 1)
** prefer reduce for sums 
* Prefer Location to Point. Location implies coordinates, Point is something that has location but also extra stuff
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
* Avoid lodash, use native JS 
* libraries allowed: 
** js-combinatronics (for permutation / combination)
** spark-mp5 (md5 generation)

## Regex
* Prefer match with /g than matchAll, as in

      "abcabfgabsefd".match(/ab/) => ['ab', index: 0, input: 'abcabfgabsefd', groups: undefined]
      "abcabfgabsefd".match(/ab/g) => ['ab', 'ab', 'ab']
      "123123123".match(/ab/) => null

## Path finding

* use pop() instead of splice(-1)[0]
* terminology: 
** step: a node with extra info (location, distance/score, etc) 
** path: list of steps. 
** head: latest step from a path
** queue instead of opened 

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
Note that when printing worlds, world matrixes are seen as rows and columns, so make sure locations 
use same system. If they use x/y, they may refer to col/row instead of row/col

# Aååendixes

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
