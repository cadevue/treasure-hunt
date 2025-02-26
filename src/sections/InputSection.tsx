import { useState, useCallback, useEffect } from "react";
import SectionTitle from "../components/SectionTitle";
import { MazeSymbol, SolveResult } from "../utils/types";
import { PREDEFINED_MAZES } from "../utils/const";
import { solveBFS, solveDFS } from "../utils/solver";

interface InputSectionProps {
    setSolveResult: (result: any) => void;
}

const VALID_SYMBOLS = new Set(Object.values(MazeSymbol));

const parseMazeString = (mazeString: string): { maze: MazeSymbol[][] | null; error: string | null } => {
    const rows = mazeString.split("\n").map(row => row.trim());
    let invalidSymbol: string | null = null;

    for (const row of rows) {
        const symbols = row.split(" ") as MazeSymbol[];
        for (const symbol of symbols) {
            if (!VALID_SYMBOLS.has(symbol)) {
                invalidSymbol = symbol;
                break;
            }
        }
        if (invalidSymbol) break;
    }

    if (invalidSymbol) {
        return { maze: null, error: `Invalid configuration: unknown symbol \`${invalidSymbol}\`` };
    }

    const maze = rows.map(row => row.split(" ") as MazeSymbol[]);
    return { maze, error: null };
};

const InputSection = ({ setSolveResult }: InputSectionProps) => {
    const [mazeState, setMazeState] = useState<MazeSymbol[][]>([]);
    const [mazeString, setMazeString] = useState("");
    const [isConfigReadOnly, setIsConfigReadOnly] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<"bfs" | "dfs">("bfs");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /** Handle Maze Selection */
    const handleSelectedMazeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value: mazeKey } = event.target;

        if (mazeKey === "custom") {
            if (!mazeString) return;

            setMazeString("");
            setIsConfigReadOnly(false);
            setMazeState([]);
            setSolveResult(null);
            return;
        }

        const selectedMazeString = PREDEFINED_MAZES[mazeKey as keyof typeof PREDEFINED_MAZES].value;
        setMazeString(selectedMazeString || "");
        setIsConfigReadOnly(true);

        const { maze } = parseMazeString(selectedMazeString);
        setMazeState(maze || []);
        setSolveResult(null);

    }, [mazeString, setMazeState]);


    /** Handle Custom Input Parsing */
    useEffect(() => {
        if (!mazeString.trim()) {
            setMazeState([]);
            setErrorMessage(null);
            return;
        }

        const { maze, error } = parseMazeString(mazeString);
        if (error) {
            setErrorMessage(error);
            return;
        }

        setErrorMessage(null);
        setMazeState(maze!);
    }, [mazeString, setMazeState]);


    /** Handle Algorithm Selection */
    const handleAlgorithmChange = useCallback((algorithm: "bfs" | "dfs") => {
        setSelectedAlgorithm(algorithm);
        setSolveResult(null);
    }, [setSelectedAlgorithm, setSolveResult]);

    /** On Search Button Clicked */
    const handleSearch = useCallback(() => {
        if (!mazeState.length) {
            setErrorMessage("Maze configuration is empty");
            return;
        }

        // Solve Maze
        let result : SolveResult;
        if (selectedAlgorithm === "bfs") {
            result = solveBFS(mazeState);
        } else {
            result = solveDFS(mazeState);
        }

        setSolveResult(result);

    }, [mazeState, selectedAlgorithm, setSolveResult]);

    return (
        <section className="w-full flex flex-col gap-4">
            <SectionTitle title="Input" />

            {/* Maze Selection */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="maze" className="font-bold">Select a Maze</label>
                <select
                    name="maze"
                    id="maze"
                    className="w-full p-2 border-2 border-main-black rounded-lg text-base"
                    onChange={handleSelectedMazeChange}
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

                {/* Error Message */}
                {errorMessage && (
                    <p className="text-red-600 font-bold">{errorMessage}</p>
                )}
            </div>

            {/* Algorithm Selection */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-bold">Algorithm</label>
                <div className="w-full flex gap-1">
                    <button className={`w-1/2 p-2 rounded-lg font-bold border-2 cursor-pointer
                        ${selectedAlgorithm === "bfs" 
                            ? "bg-main-red text-white border-main-red"
                            : "bg-white text-main-black border-main-black"
                        }`}
                        onClick={() => handleAlgorithmChange("bfs")}
                    >
                        BFS
                    </button>
                    <button className={`w-1/2 p-2 rounded-lg font-bold border-2 cursor-pointer
                        ${selectedAlgorithm === "dfs" 
                            ? "bg-main-red text-white border-main-red"
                            : "bg-white text-main-black border-main-black"
                        }`}
                        onClick={() => handleAlgorithmChange("dfs")}
                    >
                        DFS
                    </button>
                </div>
            </div>

            {/* Search Button */}
            <button className="w-full p-2 mt-4 bg-main-red text-white rounded-lg font-bold 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red cursor-pointer"
                disabled={!!errorMessage}
                onClick={handleSearch}
            >
                Search
            </button>
        </section>
    );
};

export default InputSection;
