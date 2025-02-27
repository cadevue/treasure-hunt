export enum MazeSymbol {
    Start    = "S",
    Treasure = "T",
    Path     = "R",
    Wall     = "X",
}

export enum Direction {
    Right    = "R",
    Down     = "D",
    Up       = "U",
    Left     = "L",
}

export type Point = [number, number];

export interface SolveInput {
    maze: MazeSymbol[][];
    numOfTreasures: number;
    startCell: Point;
}

export interface SolveResult {
    maze: MazeSymbol[][];
    searchRoute: Direction[];
    finalRoute: Direction[];
    nodesVisited: number;
    executionTime: DOMHighResTimeStamp;
}
