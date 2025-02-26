export enum MazeSymbol {
    Start    = "S",
    Treasure = "T",
    Path     = "R",
    Wall     = "X",
}

export enum Direction {
    Up       = "U",
    Right    = "R",
    Down     = "D",
    Left     = "L",
}

export interface SolveInput {
    maze: MazeSymbol[][];
    numOfTreasures: number;
    startCell: [number, number];
}

export interface SolveResult {
    maze: MazeSymbol[][];
    route: Direction[];
    nodesVisited: number;
    executionTime: number;
}