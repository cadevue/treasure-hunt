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
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-fit">
                    <div className="font-bold">Route          </div> <div>{solveResult.route.join(" -> ")}</div>
                    <div className="font-bold">Nodes Visited  </div> <div>{solveResult.nodesVisited}</div>
                    <div className="font-bold">Execution Time </div> <div>{solveResult.executionTime}ms</div>
                </div>
            }

        </section>
    );
}

export default ResultSection;