import SectionTitle from "../components/SectionTitle";
import { SolveResult } from "../utils/types";

interface ResultSectionProps {
    solveResult: SolveResult | null;
}

const ResultSection = ({ solveResult }: ResultSectionProps) => {
    return (
        <section className="w-full flex flex-col gap-4 justify-center">
            <SectionTitle title="Result Summary" />
            {
                solveResult === null 
                ?
                <p className="w-full text-left">No result yet</p>
                :
                <>
                <p>
                    The search algorithm has found the path to the treasure! <br />
                </p>
                <div className="grid grid-cols-[auto_1fr] gap-x-12 gap-y-3 w-full">
                    <div className="font-bold py-1">Search Route</div> 
                    <div className="font-mono text-nowrap py-1 pr-4 overflow-x-auto">
                        {
                            solveResult.searchRoute.length === 0
                            ? "No route found"
                            : solveResult.searchRoute.join(" → ")
                        }
                    </div>

                    {/* <div className="font-bold py-1">Final Route</div>
                    <div className="font-mono text-nowrap py-1 pr-4 overflow-x-auto">
                        {
                            solveResult.finalRoute.length === 0
                            ? "No route found"
                            : solveResult.finalRoute.join(" → ")
                        }
                    </div> */}

                    <div className="font-bold">Nodes Visited</div> 
                    <div>{solveResult.nodesVisited}</div>

                    <div className="font-bold">Execution Time</div>
                    <div>{solveResult.executionTime} ms</div>
                </div>
                {/* 
                <p> <i> <br />
                    Note: Final route doesn't ensure the shortest path, but rather follows the order in which the search algorithm 
                    found the treasures. If there's only one treasure, then the final route will be the shortest path.
                </i> </p> 
                */}
                </>
            }

        </section>
    );
}

export default ResultSection;