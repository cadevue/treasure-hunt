import { Direction, MazeSymbol, SolveInput, SolveResult } from "./types";

export function solveDFS({maze, numOfTreasures, startCell}: SolveInput) : SolveResult {
    return {
        maze: maze,
        route: [Direction.Up, Direction.Right, Direction.Down, Direction.Left],
        nodesVisited: 0,
        executionTime: 0,
    };
}

export function solveBFS({maze, numOfTreasures, startCell}: SolveInput) : SolveResult {
    return {
        maze: maze,
        route: [Direction.Up, Direction.Right, Direction.Down, Direction.Left],
        nodesVisited: 0,
        executionTime: 0,
    };
}