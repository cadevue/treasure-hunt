import { useState, useCallback, useEffect, useMemo } from "react";
import SectionTitle from "../components/SectionTitle";
import { MapSymbol, Point, SolveInput } from "../utils/types";
import { PREDEFINED_MAPS } from "../utils/const";
import { solveBFS, solveDFS } from "../utils/solver";

interface InputSectionProps {
    setSolveResult: (result: any) => void;
    blockAction: boolean;
}

const VALID_SYMBOLS = new Set(Object.values(MapSymbol));

const parseMapString = (mapString: string): { result: SolveInput | null; error: string | null } => {
    const rows = mapString.trim().toUpperCase().split("\n").map(row => row.trim());

    let invalidSymbol: string | null = null;
    let startCell: [number, number] | null = null;
    const treasureCells: Point[] = [];

    const map = rows.map((row, rowIndex) => {
        const symbols = row.split(" ") as MapSymbol[];
        symbols.forEach((symbol, colIndex) => {
            if (!VALID_SYMBOLS.has(symbol)) {
                invalidSymbol = `Unknown symbol ${symbol}`;
                return;
            }
            if (symbol === MapSymbol.Treasure) treasureCells.push([rowIndex, colIndex]);
            if (symbol === MapSymbol.Start) {
                if (startCell) invalidSymbol = "Multiple start cells";
                startCell = [rowIndex, colIndex];
            }
        });
        return symbols;
    });

    if (invalidSymbol) return { result: null, error: `Invalid configuration: ${invalidSymbol}` };
    if (!treasureCells.length) return { result: null, error: "Invalid configuration: no treasures found" };
    if (!startCell) return { result: null, error: "Invalid configuration: missing start cell" };

    return { result: { map, treasureCells, numOfTreasures: treasureCells.length, startCell }, error: null };
};

const InputSection = ({ setSolveResult, blockAction }: InputSectionProps) => {
    const defaultInput = useMemo(() => parseMapString(PREDEFINED_MAPS.default.value).result!, []);
    const mapOptions = useMemo(() => 
        Object.entries(PREDEFINED_MAPS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
        )), []
    );

    const [solveInputState, setSolveInput] = useState(defaultInput);
    const [mapString, setMapString] = useState(PREDEFINED_MAPS.default.value);
    const [isConfigReadOnly, setIsConfigReadOnly] = useState(true);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<"bfs" | "dfs">("bfs");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [searchCompleted, setSearchCompleted] = useState(false);

    /** Handle Reset State */
    const resetState = useCallback(() => {
        setSolveResult(null);
        setSearchCompleted(false);
    }, [setSolveResult]);

    /** Handle Map Selection */
    const handleSelectedMapChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const mapKey = event.target.value;
        resetState();

        if (mapKey === "custom") {
            setMapString("");
            setIsConfigReadOnly(false);
            setSolveInput({ map: [], numOfTreasures: 0, startCell: [-1, -1], treasureCells: [] });
            return;
        }

        const selectedMapString = PREDEFINED_MAPS[mapKey as keyof typeof PREDEFINED_MAPS]?.value || "";
        setMapString(selectedMapString);
        setIsConfigReadOnly(true);

        const { result, error } = parseMapString(selectedMapString);
        setErrorMessage(error);
        if (result) setSolveInput(result);
    }, [resetState]);

    /** Handle Custom Input Parsing */
    useEffect(() => {
        if (!isConfigReadOnly) {
            const { result, error } = parseMapString(mapString);
            setErrorMessage(error);
            if (result) setSolveInput(result);
        }
    }, [mapString, isConfigReadOnly]);

    /** Handle Algorithm Selection */
    const handleAlgorithmChange = useCallback((algorithm: "bfs" | "dfs") => {
        setSelectedAlgorithm(algorithm);
        resetState();
    }, [resetState]);

    /** Handle Search Execution */
    const handleSearch = useCallback(() => {
        if (searchDisabled) return;

        setSearchDisabled(true);
        const solveFunction = selectedAlgorithm === "bfs" ? solveBFS : solveDFS;

        solveFunction(solveInputState)
            .then(setSolveResult)
            .finally(() => {
                setSearchDisabled(false);
                setSearchCompleted(true);
            });
    }, [solveInputState, selectedAlgorithm, setSolveResult, searchDisabled]);

    return (
        <section className="w-full flex flex-col gap-4">
            <SectionTitle title="Input" />

            {/* Map Selection */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="map" className="font-bold">Select a Map</label>
                <select
                    id="map"
                    className="w-full p-2 border-2 border-main-black rounded-lg text-base"
                    onChange={handleSelectedMapChange}
                    defaultValue="default"
                >
                    <option value="custom">Custom Map</option>
                    {mapOptions}
                </select>
            </div>

            {/* Map Configuration */}
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="map-config" className="font-bold">Map Configuration</label>
                <textarea
                    id="map-config"
                    className="w-full p-2 border-2 border-main-black rounded-lg resize-none font-mono 
                        disabled:text-gray-500 disabled:bg-gray-200 disabled:border-gray-200"
                    placeholder="Write your map configuration here"
                    rows={8}
                    value={mapString}
                    disabled={isConfigReadOnly}
                    onChange={(e) => setMapString(e.target.value)}
                />
                {errorMessage && <p className="text-red-600 font-bold">{errorMessage}</p>}
            </div>

            {/* Algorithm Selection */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-bold">Algorithm</label>
                <p>The search algorithm will prioritize direction in the order of Right, Down, Up, Left</p>
                <div className="w-full flex gap-1 mt-1">
                    {["bfs", "dfs"].map((alg) => (
                        <button key={alg}
                            className={`w-1/2 p-2 rounded-lg font-bold border-2 cursor-pointer
                                ${selectedAlgorithm === alg
                                    ? "bg-main-accent text-white border-main-accent"
                                    : "bg-white text-main-black border-main-black"
                                }`}
                            onClick={() => handleAlgorithmChange(alg as "bfs" | "dfs")}
                        >
                            {alg.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Button */}
            <button className="w-full p-2 mt-6 bg-main-accent text-white rounded-lg font-bold 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red cursor-pointer"
                disabled={!!errorMessage || searchDisabled || blockAction}
                onClick={handleSearch}
            >
                Search
            </button>
            {searchCompleted && <p>Search Completed!</p>}
        </section>
    );
};

export default InputSection;
