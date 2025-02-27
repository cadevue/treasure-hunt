import { useState } from "react"

import ContentLayout from "./layouts/ContentLayout"
import HeaderSection from "./sections/HeaderSection"
import InputSection from "./sections/InputSection"
import InstructionSection from "./sections/InstructionSection"
import ResultSection from "./sections/ResultSection"
import VisualizerSection from "./sections/VisualizerSection"

import { SolveResult } from "./utils/types"
import FooterSection from "./sections/FooterSection"

function App() {
    const [solveResult, setSolveResult] = useState<SolveResult | null>(null)
    const [blockAction, setBlockAction] = useState<boolean>(false)

    return (
        <ContentLayout>
            <div className="flex flex-col items-center gap-10 py-10">
                <HeaderSection />
                <InstructionSection />
                <InputSection setSolveResult={setSolveResult} blockAction={blockAction} />
                <VisualizerSection solveResult={solveResult} setBlockAction={setBlockAction} />
                <ResultSection solveResult={solveResult} />
                <FooterSection />
            </div>
        </ContentLayout>
    )
}

export default App
