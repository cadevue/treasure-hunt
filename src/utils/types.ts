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
    numOfTreasures: number;
    startCell: Point;
}

export interface SolveResult {
    map: MapSymbol[][];
    searchRoute: Direction[];
    finalRoute: Direction[];
    nodesVisited: number;
    executionTime: DOMHighResTimeStamp;
}
