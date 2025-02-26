import { useState, useCallback } from "react";

import SectionTitle from "../components/SectionTitle";
import { PREDEFINED_MAZES } from "../utils/const";
import { MazeSymbol } from "../utils/maze";

interface InputSectionProps {
    setMazeState: (maze: MazeSymbol[][]) => void;
}

const parseMazeString = (mazeString: string): MazeSymbol[][] => {
    return mazeString.split("\n").map(row => row.split(" ") as MazeSymbol[]);
}

const InputSection = ({ setMazeState }: InputSectionProps) => {
    const [mazeString, setMazeString] = useState("");
    const [isConfigReadOnly, setIsConfigReadOnly] = useState(false);

    const handleMazeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value: mazeKey } = event.target;

        if (mazeKey === "custom") {
            if (!mazeString) return;

            setMazeString("");
            setIsConfigReadOnly(false);
            setMazeState(parseMazeString(mazeString));
            return;
        }

        const selectedMaze = PREDEFINED_MAZES[mazeKey as keyof typeof PREDEFINED_MAZES]?.value;
        setMazeString(selectedMaze || "");
        setIsConfigReadOnly(true);
        setMazeState(parseMazeString(selectedMaze || ""));
    }, [mazeString]);

    return (
        <section className="w-full flex flex-col gap-4">
            <SectionTitle title="Input" />
            {/* Maze Selection */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="maze" className="font-bold">Select a Maze</label>
                <select
                    name="maze"
                    id="maze"
                    className="w-full p-2 border-2 border-main-black rounded-lg"
                    onChange={handleMazeChange}
                    defaultValue="custom"
                >
                    <option value="custom">Custom Maze</option>
                    {Object.entries(PREDEFINED_MAZES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>
            
            {/* Maze Configuration */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="maze-config" className="font-bold">Maze Configuration</label>
                <textarea
                    name="maze-config"
                    id="maze-config"
                    className="w-full p-2 border-2 border-main-black rounded-lg resize-none font-mono 
                        disabled:text-gray-500 disabled:bg-gray-200 disabled:border-gray-200"
                    placeholder="Write your maze configuration here"
                    rows={8}
                    value={mazeString}
                    disabled={isConfigReadOnly}
                    onChange={(e) => setMazeString(e.target.value)}
                />
            </div>

            {/* Search Button */}
            <button className="w-full p-2 bg-main-red text-white rounded-lg font-bold">
                Search
            </button>
        </section>
    );
};

export default InputSection;
