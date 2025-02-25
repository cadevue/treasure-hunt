import { useState, useCallback } from "react";

import SectionTitle from "../components/SectionTitle";
import { PREMADE_MAZES } from "../const";

const InputSection = () => {
    const [mazeConfig, setMazeConfig] = useState("");
    const [isConfigReadOnly, setIsConfigReadOnly] = useState(true);

    const handleMazeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value: mazeKey } = event.target;

        if (mazeKey === "custom") {
            if (!mazeConfig) return;

            setMazeConfig("");
            setIsConfigReadOnly(false);
            return;
        }

        const selectedMaze = PREMADE_MAZES[mazeKey as keyof typeof PREMADE_MAZES]?.value;
        setMazeConfig(selectedMaze || "");
        setIsConfigReadOnly(true);
    }, [mazeConfig]);

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
                    {Object.entries(PREMADE_MAZES).map(([key, { label }]) => (
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
                    className="w-full p-2 border-2 border-main-black rounded-lg resize-none font-mono disabled:text-gray-500"
                    placeholder="Write your maze configuration here"
                    rows={8}
                    value={mazeConfig}
                    disabled={isConfigReadOnly}
                    onChange={(e) => setMazeConfig(e.target.value)}
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
