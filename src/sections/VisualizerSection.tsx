// import { Sprite, Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { MazeSymbol } from "../utils/maze";
interface VisualizerSectionProps {
    mazeState: MazeSymbol[][];
}

const VisualizerSection = ({ mazeState }: VisualizerSectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resizeCanvas = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.getBoundingClientRect().width;
            const cols = mazeState[0].length;
            const cellSize = width / cols;
            const height = mazeState.length * cellSize;
            setCanvasSize({ width, height });
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [mazeState]);

    return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
            {
                mazeState.length === 0 
                ? 
                (
                    <p className="w-full text-left">Maze is empty 😢</p>
                ) 
                :
                <div className="w-full bg-gray-200" ref={containerRef}>
                    <canvas width={canvasSize.width} height={canvasSize.height}>

                    </canvas>
                </div>
            }
        </section>
    );
}

export default VisualizerSection;