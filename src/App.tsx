import { useState } from "react"

import ContentLayout from "./layouts/ContentLayout"
import HeaderSection from "./sections/HeaderSection"
import InputSection from "./sections/InputSection"
import InstructionSection from "./sections/InstructionSection"
import ResultSection from "./sections/ResultSection"
import VisualizerSection from "./sections/VisualizerSection"

import { SolveResult } from "./utils/types"

function App() {
    const [solveResult, setSolveResult] = useState<SolveResult | null>(null)

    return (
        <ContentLayout>
            <div className="flex flex-col items-center gap-10 py-10">
                <HeaderSection />
                <InstructionSection />
                <InputSection setSolveResult={setSolveResult} />
                <VisualizerSection solveResult={solveResult} />
                <ResultSection solveResult={solveResult} />
            </div>
        </ContentLayout>
    )
}

export default App
