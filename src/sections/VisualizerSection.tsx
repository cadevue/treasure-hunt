// import { Sprite, Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { MazeSymbol, SolveResult } from "../utils/types";
interface VisualizerSectionProps {
    solveResult: SolveResult | null;
}

const VisualizerSection = ({ solveResult }: VisualizerSectionProps) => {
    if (!solveResult) return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
            <p className="w-full text-left">Visualization will appear here. Run the search algorithm first!</p>
        </section>
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [timePerStep, setTimePerStep] = useState(100);

    /** Handle Resize */
    useEffect(() => {
        const resizeCanvas = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.getBoundingClientRect().width;
            const cols = solveResult.maze[0].length;
            const cellSize = width / cols;
            const height = solveResult.maze.length * cellSize;

            const maxHeight = window.innerHeight * 0.9;
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
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const cols = solveResult.maze[0].length;
        const rows = solveResult.maze.length;
        const cellSize = canvasSize.width / cols;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * cellSize;
                const y = row * cellSize;

                const cell = solveResult.maze[row][col];
                switch (cell) {
                    case MazeSymbol.Treasure:
                        ctx.fillStyle = "#ffff00";
                        break;
                    case MazeSymbol.Wall:
                        ctx.fillStyle = "#000000";
                        break;
                    case MazeSymbol.Path:
                    case MazeSymbol.Start:
                        ctx.fillStyle = "#ffffff";
                        break;
                    default:
                        continue;
                }

                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }, [solveResult, canvasSize]);

    return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
        {
            solveResult.maze.length === 0 ? 

            /** Maze is Empty */
            <p className="w-full text-left">Maze is empty 😢</p>

            :
            
            /** Maze is not Empty. Draw Maze in Canvas */
            <>
            <div className="w-full" ref={containerRef}>
                <canvas width={canvasSize.width} height={canvasSize.height} ref={canvasRef}
                    className="border-2 border-main-black mx-auto"
                />
            </div>
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="time-per-step" className="font-bold">Time per Step (ms)</label>
                <div className="w-full flex items-center gap-2">
                    <input type="range" id="time-per-step"  
                        value={timePerStep} onChange={e => setTimePerStep(parseInt(e.target.value))}
                        min={0} max={1000} step={10}
                    />
                    <span>{timePerStep}</span>
                </div>
            </div>
            <button className="w-full p-2 bg-main-red text-white rounded-lg font-bold">
                Visualize
            </button>
            </>

        }
        </section>
    );
}

export default VisualizerSection;