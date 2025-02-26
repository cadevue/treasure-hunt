import { Direction, MazeSymbol, SolveResult } from "./types";

export function solveDFS(maze: MazeSymbol[][]) : SolveResult {
    return {
        maze: maze,
        route: [Direction.Up, Direction.Right, Direction.Down, Direction.Left],
        nodesVisited: 0,
        executionTime: 0,
    };
}

export function solveBFS(maze: MazeSymbol[][]) : SolveResult {
    return {
        maze: maze,
        route: [Direction.Up, Direction.Right, Direction.Down, Direction.Left],
        nodesVisited: 0,
        executionTime: 0,
    };
}