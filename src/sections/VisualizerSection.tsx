import SectionTitle from "../components/SectionTitle";
import { MazeSymbol } from "../utils/maze";

interface VisualizerSectionProps {
    mazeState: MazeSymbol[][];
}

const VisualizerSection = ({ mazeState }: VisualizerSectionProps) => {
    /** Need Maze state for visualization */
    return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
            {/* <div className="w-full aspect-square bg-gray-200" /> */}
            <div className="grid" style={{ gridTemplateColumns: `repeat(${mazeState[0]?.length || 1}, 1fr)` }}>
                {mazeState.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-10 h-10 flex items-center justify-center border ${
                                cell === MazeSymbol.Wall ? "bg-black" : cell === MazeSymbol.Treasure ? "bg-yellow-400" : "bg-white"
                            }`}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default VisualizerSection;