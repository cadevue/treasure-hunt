import { useState, useCallback, useEffect, useMemo } from "react";
import SectionTitle from "../components/SectionTitle";
import { MapSymbol, SolveInput } from "../utils/types";
import { PREDEFINED_MAPS } from "../utils/const";
import { solveBFS, solveDFS } from "../utils/solver";

interface InputSectionProps {
    setSolveResult: (result: any) => void;
}

const VALID_SYMBOLS = new Set(Object.values(MapSymbol));

const parseMapString = (mapString: string): { result : SolveInput | null; error: string | null } => {
    if (mapString.trim() === "") {
        return { result: null, error: "Map configuration cannot be empty" };
    }

    const rows = mapString.split("\n").map(row => row.trim());
    let invalidSymbol: string | null = null;
    let treasureCount = 0;
    let startCell = [-1, -1];

    for (const row of rows) {
        const symbols = row.split(" ") as MapSymbol[];
        for (const symbol of symbols) {
            if (!VALID_SYMBOLS.has(symbol)) {
                invalidSymbol = symbol;
                break;
            }

            if (symbol === MapSymbol.Treasure) {
                treasureCount++;
            }

            if (symbol === MapSymbol.Start) {
                if (startCell[0] !== -1) {
                    return { result: null, error: "Invalid configuration: multiple start cells" };
                }
                startCell = [rows.indexOf(row), symbols.indexOf(symbol)];
            }
        }
        if (invalidSymbol) break;
    }

    if (invalidSymbol) {
        return { result: null, error: `Invalid configuration: unknown symbol \`${invalidSymbol}\`` };
    }

    if (treasureCount <= 0) {
        return { result: null, error: "Invalid configuration: no treasures found" };
    }

    const map = rows.map(row => row.split(" ") as MapSymbol[]);
    const result = {
        map: map,
        numOfTreasures: treasureCount,
        startCell: startCell as [number, number],
    };
    return { result, error: null };
};

const InputSection = ({ setSolveResult }: InputSectionProps) => {
    const defaultInput = useMemo(() => parseMapString(PREDEFINED_MAPS.simple.value).result!, []);

    const [solveInputState, setSolveInput] = useState<SolveInput>(defaultInput);
    const [mapString, setMapString] = useState(PREDEFINED_MAPS.simple.value);
    const [isConfigReadOnly, setIsConfigReadOnly] = useState(true);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<"bfs" | "dfs">("bfs");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchDisabled, setSearchDisabled] = useState(false);

    /** Handle Map Selection */
    const handleSelectedMapChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value: mapKey } = event.target;

        if (mapKey === "custom") {
            if (!mapString) return;

            setMapString("");
            setIsConfigReadOnly(false);
            setSolveInput({ map: [], numOfTreasures: 0, startCell: [-1, -1] });
            setSolveResult(null);
            return;
        }

        const selectedMapString = PREDEFINED_MAPS[mapKey as keyof typeof PREDEFINED_MAPS].value;
        setMapString(selectedMapString || "");
        setIsConfigReadOnly(true);

        const { result } = parseMapString(selectedMapString);
        setSolveInput(result!);
        setSolveResult(null);

    }, [mapString, setSolveInput]);


    /** Handle Custom Input Parsing */
    useEffect(() => {
        const { result, error } = parseMapString(mapString);
        if (error) {
            setErrorMessage(error);
            return;
        }

        setErrorMessage(null);
        setSolveInput(result!);
    }, [mapString, setSolveInput]);


    /** Handle Algorithm Selection */
    const handleAlgorithmChange = useCallback((algorithm: "bfs" | "dfs") => {
        setSelectedAlgorithm(algorithm);
        setSolveResult(null);
    }, [setSelectedAlgorithm, setSolveResult]);

    /** On Search Button Clicked */
    const handleSearch = useCallback(() => {
        setSearchDisabled(true);

        // Solve Map
        if (selectedAlgorithm === "bfs") {
            solveBFS(solveInputState).then(result => {
                setSolveResult(result);
                setSearchDisabled(false);
            });
        } else {
            solveDFS(solveInputState).then(result => {
                setSolveResult(result);
                setSearchDisabled(false);
            });
        }

    }, [solveInputState, selectedAlgorithm, setSolveResult]);

    return (
        <section className="w-full flex flex-col gap-4">
            <SectionTitle title="Input" />

            {/* Map Selection */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="map" className="font-bold">Select a Map</label>
                <select
                    name="map"
                    id="map"
                    className="w-full p-2 border-2 border-main-black rounded-lg text-base"
                    onChange={handleSelectedMapChange}
                    defaultValue="simple"
                >
                    <option value="custom">Custom Map</option>
                    {Object.entries(PREDEFINED_MAPS).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>
            
            {/* Map Configuration */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="map-config" className="font-bold">Map Configuration</label>
                <textarea
                    name="map-config"
                    id="map-config"
                    className="w-full p-2 border-2 border-main-black rounded-lg resize-none font-mono 
                        disabled:text-gray-500 disabled:bg-gray-200 disabled:border-gray-200"
                    placeholder="Write your map configuration here"
                    rows={8}
                    value={mapString}
                    disabled={isConfigReadOnly}
                    onChange={(e) => setMapString(e.target.value)}
                />

                {/* Error Message */}
                {errorMessage && (
                    <p className="text-red-600 font-bold">{errorMessage}</p>
                )}
            </div>

            {/* Algorithm Selection */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-bold">Algorithm</label>
                <p> The search algorithm will prioritize direction in the order of Right, Down, Up, Left </p>
                <div className="w-full flex gap-1 mt-1">
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
            <button className="w-full p-2 mt-6 bg-main-red text-white rounded-lg font-bold 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red cursor-pointer"
                disabled={!!errorMessage || searchDisabled}
                onClick={handleSearch}
            >
                Search
            </button>
        </section>
    );
};

export default InputSection;
