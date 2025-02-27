export enum MapSymbol {
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
    map: MapSymbol[][];
    startCell: Point;
    treasureCells: Point[];
    numOfTreasures: number;
}

export interface SolveResult {
    map: MapSymbol[][];
    startCell: Point;
    treasureCells: Point[];
    searchRoute: Direction[];
    solutionFound: boolean;
    nodesVisited: number;
    executionTime: DOMHighResTimeStamp;
}
