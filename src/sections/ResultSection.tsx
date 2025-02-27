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
                        {
                            !solveResult.solutionFound &&
                            <span> (No solution)</span>
                        }
                    </div>
                    <div className="font-bold">Nodes Visited</div> 
                    <div>{solveResult.nodesVisited}</div>

                    <div className="font-bold">Execution Time</div>
                    <div>{solveResult.executionTime} ms</div>
                </div>
                </>
            }

        </section>
    );
}

export default ResultSection;