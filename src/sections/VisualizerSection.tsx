import { useEffect, useRef, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { Direction, MapSymbol, Point, SolveResult } from "../utils/types";

import shipImg from "../assets/ship.png";
import landImg from "../assets/land.png";
import waterImg from "../assets/water.png";
import treasureImg from "../assets/treasure.png";

interface VisualizerSectionProps {
    solveResult: SolveResult | null;
    setBlockAction: (block: boolean) => void;
}

const imageSources = {
    "Ship": shipImg,
    "Land": landImg,
    "Water": waterImg,
    "Treasure": treasureImg,
};

const shipRotation = {
    [Direction.Down]: 0,
    [Direction.Up]: 180,
    [Direction.Left]: 90,
    [Direction.Right]: 270,
}

async function loadImages() : Promise<Record<string, HTMLImageElement>> {
    const imagePromises = Object.entries(imageSources).map(async ([name, src]) => {
        const img = new Image();
        img.src = src;
        await new Promise(resolve => img.onload = resolve);
        return [name, img] as const;
    });

    const images = await Promise.all(imagePromises);
    return Object.fromEntries(images);
}

async function drawMap(
    canvas: HTMLCanvasElement, 
    map: MapSymbol[][],
    images: Record<string, HTMLImageElement>,
    shipPosition: Point,
    shipDirection: Direction,
    treasurePositions: Point[],
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!images["Land"] || 
        !images["Water"] || 
        !images["Ship"] || 
        !images["Treasure"]) 
    {
        return;
    }

    const cols = map[0].length;
    const rows = map.length;
    const cellSize = canvas.width / cols;


    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellSize;
            const y = row * cellSize;

            const cell = map[row][col];
            switch (cell) {
                case MapSymbol.Wall:
                    ctx.drawImage(images["Land"], x, y, cellSize, cellSize);
                    break;
                case MapSymbol.Path:
                case MapSymbol.Start:
                case MapSymbol.Treasure:
                    ctx.drawImage(images["Water"], x, y, cellSize, cellSize);
                    break;
                default:
                    continue;
            }

            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }

    treasurePositions.forEach(([row, col]) => {
        ctx.drawImage(images["Treasure"], col * cellSize, row * cellSize, cellSize, cellSize);
    });

    const [shipRow, shipCol] = shipPosition;
    ctx.save();
    ctx.translate((shipCol + 0.5) * cellSize, (shipRow + 0.5) * cellSize);
    ctx.rotate((shipRotation[shipDirection] * Math.PI) / 180);
    ctx.drawImage(images["Ship"], -cellSize / 2, -cellSize / 2, cellSize, cellSize);
    ctx.restore();
}

const VisualizerSection = ({ solveResult, setBlockAction }: VisualizerSectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [speed, setSpeed] = useState(1);
    const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
    const [isAnimating, setIsAnimating] = useState(false);

    const shipPositionRef = useRef<Point>([0, 0]);
    const shipDirectionRef = useRef<Direction>(Direction.Right);
    const treasurePositionsRef = useRef<Point[]>([]);

    /** Load Images */
    useEffect(() => {
        loadImages().then(setImages);
    }, []);

    /** Handle Resize */
    useEffect(() => {
        const resizeCanvas = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.getBoundingClientRect().width;
            const cols = solveResult!.map[0].length;
            const cellSize = width / cols;
            const height = solveResult!.map.length * cellSize;

            const maxHeight = window.innerHeight * 0.75;
            if (height > maxHeight) {
                const scale = maxHeight / height;
                setCanvasSize({ width: width * scale, height: height * scale });
                return;
            }
            setCanvasSize({ width, height });
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [solveResult]);

    /** Handle Drawing */
    useEffect(() => {
        if (!canvasRef.current || !solveResult) return;
        drawMap(canvasRef.current, solveResult.map, images, shipPositionRef.current, shipDirectionRef.current, treasurePositionsRef.current);
    }, [solveResult, canvasRef, canvasSize, images]);

    /** Result sync */
    useEffect(() => {
        if (!solveResult) return

        shipPositionRef.current = solveResult.startCell;
        shipDirectionRef.current = Direction.Right;
        treasurePositionsRef.current = solveResult.treasureCells;
    }, [solveResult]);

    const speedRef = useRef(speed);
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const animateShip = () => {
        if (!solveResult) return;
        setIsAnimating(true);
        setBlockAction(true);

        shipPositionRef.current = solveResult.startCell;
        shipDirectionRef.current = Direction.Right;
        treasurePositionsRef.current = solveResult.treasureCells;

        let index = 0;
        let [row, col] = solveResult.startCell;
        let remainingTreasures = new Set(solveResult.treasureCells.map(([row, col]) => `${row},${col}`));
        const route = solveResult.searchRoute;

        let previousTime = performance.now();
        let deltaTime = 0;

        let [lerpedRow, lerpedCol] = [row, col];

        function animate(timestamp: DOMHighResTimeStamp) {
            if (index >= route.length) {
                setIsAnimating(false);
                setBlockAction(false);
                return;
            }

            deltaTime = timestamp - previousTime;
            previousTime = timestamp;

            const direction = route[index];
            let target: Point = [row, col];
            let [nrow, ncol] = [row, col];
            const movement = deltaTime * speedRef.current / 200;
            switch (direction) {
                case "U": 
                    lerpedRow -= movement;
                    target = [row-1, col];
                    nrow = Math.floor(lerpedRow) + 1;
                    break;
                case "D": 
                    lerpedRow += movement;
                    target = [row+1, col];
                    nrow = Math.floor(lerpedRow);
                    break;
                case "L":
                    lerpedCol -= movement;
                    target = [row, col-1];
                    ncol = Math.floor(lerpedCol) + 1;
                    break;
                case "R":
                    lerpedCol += movement;
                    target = [row, col+1];
                    ncol = Math.floor(lerpedCol);
                    break;
            }

            const key = `${nrow},${ncol}`;
            if (remainingTreasures.has(key)) {
                remainingTreasures.delete(key);
                treasurePositionsRef.current = treasurePositionsRef.current.filter(([r, c]) => r !== nrow || c !== ncol);
            }

            if (nrow === target[0] && ncol === target[1]) {
                row = target[0];
                col = target[1];
                lerpedRow = row;
                lerpedCol = col;

                index++;
            }

            shipPositionRef.current = [lerpedRow, lerpedCol];
            shipDirectionRef.current = direction;

            const canvas = canvasRef.current;
            if (canvas) {
                drawMap(canvas, solveResult!.map, images, [lerpedRow, lerpedCol], direction, treasurePositionsRef.current);
            }

            requestAnimationFrame(animate);
        }

        animate(performance.now());
    }

    if (!solveResult) return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
            <p className="w-full text-left">Visualization will appear here after the search has been done!</p>
        </section>
    );
    
    return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
        {
            solveResult.map.length === 0 ? 

            /** Map is Empty */
            <p className="w-full text-left">Map is empty 😢</p>

            :
            
            /** Map is not Empty. Draw Map in Canvas */
            <>
            <div className="w-full" ref={containerRef}>
                <canvas width={canvasSize.width} height={canvasSize.height} ref={canvasRef}
                    className="border-2 border-main-black mx-auto"
                />
            </div>
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="time-per-step" className="font-bold">Speed</label>
                <div className="w-full flex items-center gap-2">
                    <input type="range" id="time-per-step"  
                        value={speed} onChange={e => setSpeed(parseFloat(e.target.value))}
                        min={0.25} max={5} step={0.05}
                    />
                    <span>{speed.toFixed(2)}x</span>
                </div>
            </div>
            <button className="w-full p-2 bg-main-accent text-white rounded-lg font-bold cursor-pointer disabled:opacity-50"
                onClick={animateShip} disabled={isAnimating}
            >
                Run Visualization
            </button>
            </>
        }

            <p className="text-sm">
                Important Note: <br/>

                The visualization does not represent the actual path taken by the algorithm,
                but more of an illustration of how the algorithm works. In the actual implementation, backtracking
                is not necessary as the algorithm can easily jump from one cell to another.
            </p>
        </section>
    );
}

export default VisualizerSection;