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

# Knowledge base

##  X or Y?  Rows and Columns?

row goes vertical, col goes horizontal
unless it is specified otherwise in the instructions, 
x and y should be avoided, but if not, x IS ROW, y IS COLUMN, therefore NOT EQUIVALENT to X/Y charts NOT HTML positions.

when printing world, world matrixes are also row and colum

| []()                   |                        |                        |                        |
|------------------------|------------------------|------------------------|------------------------|
| row 0, col 0, x 0, y 0 | row 0, col 1, x 0, y 1 | row 0, col 2, x 0, y 2 | row 0, col 3, x 0, y 3 |
| row 1, col 0, x 1, y 0 | row 1, col 1, x 1, y 1 | row 1, col 2, x 1, y 2 | row 1, col 3, x 1, y 3 |
| row 2, col 0, x 2, y 0 | row 2, col 1, x 2, y 1 | row 2, col 2, x 2, y 2 | row 2, col 3, x 2, y 3 |
| row 3, col 0, x 3, y 0 | row 3, col 1, x 3, y 1 | row 3, col 2, x 2, y 2 | row 3, col 3, x 3, y 3 |

## Algorithms

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

## IDEAS 

* introduce PointObj, where {x: number, y: number}

* move away from [number, number, number, string] or something, use objects so all is more readable
*  speed is good, readability is even better
* rethink renaming Point to Location. Location implies coordinates, Point is something that has location but also extra stuff
* dimension: to object where I have Height, width to better signal that the first value is for number of rows, other one is for number of colums 
* Get the terminology ready: 
* - path: succession of steps. Should it be changed?
* - head: latest step

* better describe the differences between BFS, DFS, Dijkstra, A* and why each should have: 
** visited cache
** sort by distance / heuristic / etc 
* put ths list of tags here
* Make list of templates (one template with dijkstra, etc)
