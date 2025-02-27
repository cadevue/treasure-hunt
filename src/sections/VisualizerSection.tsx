import { useEffect, useRef, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { MapSymbol, SolveResult } from "../utils/types";

import shipImg from "../assets/ship.png";
import landImg from "../assets/land.png";
import waterImg from "../assets/water.png";
import treasureImg from "../assets/treasure.png";

interface VisualizerSectionProps {
    solveResult: SolveResult | null;
}

const imageSources = {
    "Ship": shipImg,
    "Land": landImg,
    "Water": waterImg,
    "Treasure": treasureImg,
};

async function loadImages() : Promise<Record<string, HTMLImageElement>> {
    const imagePromises = Object.entries(imageSources).map(async ([name, src]) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        return [name, img] as const;
    });

    const images = await Promise.all(imagePromises);
    return Object.fromEntries(images);
}

async function drawMap(canvas: HTMLCanvasElement, solveResult: SolveResult, images: Record<string, HTMLImageElement>) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = solveResult.map[0].length;
    const rows = solveResult.map.length;
    const cellSize = canvas.width / cols;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellSize;
            const y = row * cellSize;

            const cell = solveResult.map[row][col];
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

            if (cell === MapSymbol.Start) {
                ctx.drawImage(images["Ship"], x, y, cellSize, cellSize);
            } 

            else if (cell === MapSymbol.Treasure) {
                ctx.drawImage(images["Treasure"], x, y, cellSize, cellSize);
            }

            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
}

const VisualizerSection = ({ solveResult }: VisualizerSectionProps) => {
    if (!solveResult) return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
            <p className="w-full text-left">Visualization will appear here after the search has been done!</p>
        </section>
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [timePerStep, setTimePerStep] = useState(100);
    const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

    /** Load Images */
    useEffect(() => {
        loadImages().then(setImages);
    }, []);

    /** Handle Resize */
    useEffect(() => {
        const resizeCanvas = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.getBoundingClientRect().width;
            const cols = solveResult.map[0].length;
            const cellSize = width / cols;
            const height = solveResult.map.length * cellSize;

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
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        drawMap(canvas, solveResult, images);
    }, [solveResult, canvasRef, canvasSize, images]);

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
                <label htmlFor="time-per-step" className="font-bold">Time per Step (ms)</label>
                <div className="w-full flex items-center gap-2">
                    <input type="range" id="time-per-step"  
                        value={timePerStep} onChange={e => setTimePerStep(parseInt(e.target.value))}
                        min={0} max={1000} step={10}
                    />
                    <span>{timePerStep}</span>
                </div>
            </div>
            <button className="w-full p-2 bg-main-accent text-white rounded-lg font-bold">
                Run Visualization
            </button>
            </>

        }
        </section>
    );
}

export default VisualizerSection;