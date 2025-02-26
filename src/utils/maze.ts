export enum MazeSymbol {
    Start = "S",
    Treasure = "T",
    Path = "R",
    Wall = "X",
}

export const PREDEFINED_MAZES = {
"simple": {
    label: "Simple",
    value: [
        "X X X X",
        "X R R T",
        "S R X T",
        "X R X R",
        "X R R R"
    ].join("\n")
},

"locked": {
    label: "Locked",
    value: [
        "X X X X X X X X",
        "X X X X X X X X",
        "X X T S R T X X",
        "X X X X X X X X",
        "X X X X X X X X"
    ].join("\n")
},

"long": {
    label: "Long",
    value: [
        "S T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
        "X T R X",
    ].join("\n"),
},

"triangle": {
    label: "Triangle",
    value: [
        "S X X X X X",
        "R R X X X X",
        "R R R X X X",
        "R R R R X X",
        "R R R R R X",
        "R R R R R T",
    ].join("\n"),
},

"unique": {
    label: "Unique",
    value: [
        "S R R R R R R",
        "X R X X T X R",
        "X R X X R X R",
        "X R X X R X R",
        "X T X X X X R",
        "X X X X X X T",
        "X R R X X X R",
    ].join("\n"),
},

"maze-1": {
    label: "Maze 1",
    value: [
        "S R R R",
        "X R X T",
        "X T R R",
        "X R X X"
    ].join("\n"),
},

"maze-2": {
    label: "Maze 2",
    value: [
        "S R R R R R X",
        "X R X T X R R",
        "X T X R X R X",
        "X R X X X T X",
        "X T X X X X X",
    ].join("\n"),
},

"maze-3": {
    label: "Maze 3",
    value: [
        "S R R R R",
        "X X R X T",
        "X X T X X",
    ].join("\n"),
},

"maze-4": {
    label: "Maze 4",
    value: [
        "S R R R",
        "R X X T",
        "R R R R",
        "X R X X",
    ].join("\n"),
},

"maze-5": {
    label: "Maze 5",
    value: [
        "S R R R R",
        "R X X X R",
        "R X X X R",
        "R R R R R",
        "X X X R X",
        "X X X T X",
    ].join("\n"),
},

"maze-6": {
    label: "Maze 6",
    value: [
        "S R R X X X X X X X",
        "R X R R R R R X X X",
        "T X X X R X X X X X",
        "R R R R R R X X X X",
        "X X X R X R X X X X",
        "X X R R X R X X X X",
        "T R R X X R X X X X",
        "X X X R R R R R R T",
        "X T R R X X X X X R",
        "X X X X X X X X X T",
    ].join("\n"),
},

"maze-7": {
    label: "Maze 7",
    value: [
        "R R R R",
        "T X R R",
        "S R R R",
    ].join("\n"),
},

"maze-8": {
    label: "Maze 8",
    value: [
        "S R R R R R",
        "X R X T X X",
        "X T R R X X",
        "X R X X X X",
    ].join("\n"),
},

"maze-9": {
    label: "Maze 9",
    value: [
        "S R R R",
        "X X X X",
        "T R R R",
    ].join("\n"),
},

"maze-10": {
    label: "Maze 10",
    value: [
        "R R R X X X X X X X",
        "R R X X X X X R R R",
        "R R R R X X X X X X",
        "X X R R R S R R R R",
        "X X X X X R X R X R",
        "X X X X R R R R R R",
        "X X X X X X R R R R",
        "X X X X X X X X X T",
    ].join("\n"),
},

"no-solution": {
    label: "No Solution",
    value: [
        "R X X X X X X",
        "R R X X X X X",
        "R X T X X X X",
        "R X X R X X X",
        "R X X X R X X",
        "R X X X X R X",
        "S R R X X X R",
    ].join("\n"),
},

"error": {
    label: "Error",
    value: [
        "J A N G A N",
        "L U P A C E",
        "K Y A N G B",
        "E G I N I Y"
    ].join("\n"),
},
}