import { useState } from "react"
import ContentLayout from "./layouts/ContentLayout"
import HeaderSection from "./sections/HeaderSection"
import InputSection from "./sections/InputSection"
import InstructionSection from "./sections/InstructionSection"
import ResultSection from "./sections/ResultSection"
import VisualizerSection from "./sections/VisualizerSection"
import { MazeSymbol } from "./utils/maze"

function App() {
    const [mazeState, setMazeState] = useState<MazeSymbol[][]>([])

    return (
        <ContentLayout>
            <div className="flex flex-col items-center gap-10 py-10">
                <HeaderSection />
                <InstructionSection />
                <InputSection setMazeState={setMazeState} />
                <VisualizerSection mazeState={mazeState} />
                <ResultSection />
            </div>
        </ContentLayout>
    )
}

export default App
