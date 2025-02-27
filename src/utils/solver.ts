import { Direction, MapSymbol, Point, SolveInput, SolveResult } from "./types";

const DirectionsOffset = {
    [Direction.Up]    :  [ 0,  1],
    [Direction.Right] :  [ 1,  0],
    [Direction.Down]  :  [ 0, -1],
    [Direction.Left]  :  [-1,  0],
}

const DirectionValues = Object.values(Direction);
const DirectionValuesReversed = Object.values(Direction).reverse();

function findDirection(start: [number, number], end: [number, number]): Direction {
    const [sRow, sCol] = start;
    const [eRow, eCol] = end;

    if (sCol < eCol) return Direction.Right;
    if (sRow < eRow) return Direction.Down;
    if (sRow > eRow) return Direction.Up;
    if (sCol > eCol) return Direction.Left;

    return Direction.Right;
}

export async function solveBFS({map, numOfTreasures, startCell}: SolveInput) : Promise<SolveResult> {
    const startTime = performance.now();

    const queue : Point[] = [];
    const visited = new Set<string>();
    const parentOf = new Map<string, Point | null>();

    visited.add(`${startCell[0]},${startCell[1]}`);
    parentOf.set(`${startCell[0]},${startCell[1]}`, null);

    const [row, col] = startCell;
    let latestVisited = startCell;

    for (const direction of DirectionValues) {
        const [dCol, dRow] = DirectionsOffset[direction];
        const newRow = row - dRow;
        const newCol = col + dCol;
        const newKey = `${newRow},${newCol}`;

        if (newRow < 0 || newRow >= map.length || newCol < 0 || newCol >= map[0].length) continue;
        if (map[newRow][newCol] === MapSymbol.Wall) continue;
        if (visited.has(newKey)) continue;

        queue.push([newRow, newCol]);
        parentOf.set(newKey, [row, col]);
    }

    const searchRoute : Direction[] = [];
    const treasureLocations : Point[] = [];
    const pointsToTreasure : Map<string, Point[]> = new Map();
    
    while (queue.length > 0) {
        const [row, col] = queue.shift()!;

        if (visited.has(`${row},${col}`)) continue;

        /* Find the common parent, between last visited cell and current (to be visited) cell*/
        let p = parentOf.get(`${row},${col}`);
        const allCurrentParents : Point[] = [];

        while (p !== null) {
            allCurrentParents.push(p!);
            p = parentOf.get(`${p![0]},${p![1]}`);
        }

        let commonParent = latestVisited;
        while (!allCurrentParents.some(cell => cell[0] === commonParent[0] && cell[1] === commonParent[1])) {
            commonParent = parentOf.get(`${commonParent[0]},${commonParent[1]}`)!;
        }

        /** Traverse to common parent */
        p = parentOf.get(`${latestVisited[0]},${latestVisited[1]}`);
        while (latestVisited[0] !== commonParent[0] || latestVisited[1] !== commonParent[1]) {
            const direction = findDirection(latestVisited, p!);
            searchRoute.push(direction);
            latestVisited = p!;
            p = parentOf.get(`${p![0]},${p![1]}`);
        }

        /** Visit the current cell */
        const allCurrentParentsStack = [...allCurrentParents];
        p = allCurrentParentsStack.pop()!;
        while (p[0] !== commonParent[0] || p[1] !== commonParent[1]) {
            p = allCurrentParentsStack.pop()!;
        }

        const currentParent = parentOf.get(`${row},${col}`)!;
        while (p[0] !== currentParent[0] || p[1] !== currentParent[1]) {
            const next = allCurrentParentsStack.pop()!;
            const direction = findDirection(p, next);
            searchRoute.push(direction);
            p = next;
        }

        const direction = findDirection(p, [row, col]);
        searchRoute.push(direction);

        latestVisited = [row, col];
        visited.add(`${row},${col}`);

        if (map[row][col] === MapSymbol.Treasure) {
            numOfTreasures--;
            treasureLocations.push([row, col]);
            pointsToTreasure.set(`${row},${col}`, allCurrentParents.reverse());
        }

        if (numOfTreasures === 0) break;

        for (const direction of DirectionValues) {
            const [dCol, dRow] = DirectionsOffset[direction];
            const newRow = row - dRow;
            const newCol = col + dCol;
            const newKey = `${newRow},${newCol}`;

            if (newRow < 0 || newRow >= map.length || newCol < 0 || newCol >= map[0].length) continue;
            if (map[newRow][newCol] === MapSymbol.Wall) continue;
            if (visited.has(newKey)) continue;

            queue.push([newRow, newCol]);
            parentOf.set(newKey, [row, col]);
        }
    }

    /** Traverse to the every treasure */
    let finalRoute : Direction[] = [];
    let currentLocation = startCell;
    for (const treasure of treasureLocations) {
        const path = pointsToTreasure.get(`${treasure[0]},${treasure[1]}`)!;

        while (!path.some(cell => cell[0] === currentLocation[0] && cell[1] === currentLocation[1])) {
            const next = parentOf.get(`${currentLocation[0]},${currentLocation[1]}`)!;
            const direction = findDirection(currentLocation, next);
            finalRoute.push(direction);
            currentLocation = next;
        }

        let next = path.shift()!;
        while (next[0] !== currentLocation[0] || next[1] !== currentLocation[1]) {
            next = path.shift()!;
        }

        for (const next of path) {
            const direction = findDirection(currentLocation, next);
            finalRoute.push(direction);
            currentLocation = next;
        }

        const direction = findDirection(currentLocation, treasure);
        finalRoute.push(direction);
        currentLocation = treasure;
    }

    const elapsedTime = performance.now() - startTime;
    
    return {
        map: map,
        searchRoute: searchRoute,
        finalRoute: finalRoute,
        nodesVisited: visited.size,
        executionTime: elapsedTime,
    };
}

export async function solveDFS({map, numOfTreasures, startCell}: SolveInput) : Promise<SolveResult> {
    const startTime = performance.now();

    const stack: Point[] = [];
    const visited = new Set<string>();
    const parentOf = new Map<string, Point | null>();

    visited.add(`${startCell[0]},${startCell[1]}`);
    parentOf.set(`${startCell[0]},${startCell[1]}`, null);

    const [row, col] = startCell;
    let latestVisited = startCell;

    for (const direction of DirectionValuesReversed) {
        const [dCol, dRow] = DirectionsOffset[direction];
        const newRow = row - dRow;
        const newCol = col + dCol;
        const newKey = `${newRow},${newCol}`;

        if (newRow < 0 || newRow >= map.length || newCol < 0 || newCol >= map[0].length) continue;
        if (map[newRow][newCol] === MapSymbol.Wall) continue;
        if (visited.has(newKey)) continue;

        stack.push([newRow, newCol]);
        parentOf.set(newKey, [row, col]);
    }

    const searchRoute: Direction[] = [];
    const treasureLocations: Point[] = [];
    const pointsToTreasure: Map<string, Point[]> = new Map();

    while (stack.length > 0) {
        const [row, col] = stack.pop()!;

        if (visited.has(`${row},${col}`)) continue;

        // Backtrack to the last common parent
        let p = parentOf.get(`${row},${col}`);
        const allCurrentParents: Point[] = [];

        while (p !== null) {
            allCurrentParents.push(p!);
            p = parentOf.get(`${p![0]},${p![1]}`);
        }

        let commonParent = latestVisited;
        while (!allCurrentParents.some(cell => cell[0] === commonParent[0] && cell[1] === commonParent[1])) {
            commonParent = parentOf.get(`${commonParent[0]},${commonParent[1]}`)!;
        }

        // Move back to the common parent
        p = parentOf.get(`${latestVisited[0]},${latestVisited[1]}`);
        while (latestVisited[0] !== commonParent[0] || latestVisited[1] !== commonParent[1]) {
            const direction = findDirection(latestVisited, p!);
            searchRoute.push(direction);
            latestVisited = p!;
            p = parentOf.get(`${p![0]},${p![1]}`);
        }

        // Visit the current node
        const allCurrentParentsStack = [...allCurrentParents];
        p = allCurrentParentsStack.pop()!;
        while (p[0] !== commonParent[0] || p[1] !== commonParent[1]) {
            p = allCurrentParentsStack.pop()!;
        }

        const currentParent = parentOf.get(`${row},${col}`)!;
        while (p[0] !== currentParent[0] || p[1] !== currentParent[1]) {
            const next = allCurrentParentsStack.pop()!;
            const direction = findDirection(p, next);
            searchRoute.push(direction);
            p = next;
        }

        const direction = findDirection(p, [row, col]);
        searchRoute.push(direction);

        latestVisited = [row, col];
        visited.add(`${row},${col}`);

        if (map[row][col] === MapSymbol.Treasure) {
            numOfTreasures--;
            treasureLocations.push([row, col]);
            pointsToTreasure.set(`${row},${col}`, allCurrentParents.reverse());
        }

        if (numOfTreasures === 0) break;

        for (const direction of DirectionValuesReversed) {
            const [dCol, dRow] = DirectionsOffset[direction];
            const newRow = row - dRow;
            const newCol = col + dCol;
            const newKey = `${newRow},${newCol}`;

            if (newRow < 0 || newRow >= map.length || newCol < 0 || newCol >= map[0].length) continue;
            if (map[newRow][newCol] === MapSymbol.Wall) continue;
            if (visited.has(newKey)) continue;

            stack.push([newRow, newCol]);
            parentOf.set(newKey, [row, col]);
        }
    }

    /** Traverse to each treasure */
    let finalRoute: Direction[] = [];
    let currentLocation = startCell;
    for (const treasure of treasureLocations) {
        const path = pointsToTreasure.get(`${treasure[0]},${treasure[1]}`)!;

        while (!path.some(cell => cell[0] === currentLocation[0] && cell[1] === currentLocation[1])) {
            const next = parentOf.get(`${currentLocation[0]},${currentLocation[1]}`)!;
            const direction = findDirection(currentLocation, next);
            finalRoute.push(direction);
            currentLocation = next;
        }

        let next = path.shift()!;
        while (next[0] !== currentLocation[0] || next[1] !== currentLocation[1]) {
            next = path.shift()!;
        }

        for (const next of path) {
            const direction = findDirection(currentLocation, next);
            finalRoute.push(direction);
            currentLocation = next;
        }

        const direction = findDirection(currentLocation, treasure);
        finalRoute.push(direction);
        currentLocation = treasure;
    }

    const elapsedTime = performance.now() - startTime;

    return {
        map: map,
        searchRoute: searchRoute,
        finalRoute: finalRoute,
        nodesVisited: visited.size,
        executionTime: elapsedTime,
    };
}
