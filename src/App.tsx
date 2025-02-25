import ContentLayout from "./layouts/ContentLayout"
import HeaderSection from "./sections/HeaderSection"
import InputSection from "./sections/InputSection"
import InstructionSection from "./sections/InstructionSection"
import ResultSection from "./sections/ResultSection"
import VisualizerSection from "./sections/VisualizerSection"

function App() {
    return (
        <ContentLayout>
            <div className="flex flex-col items-center gap-10 py-10">
                <HeaderSection />
                <InstructionSection />
                <InputSection />
                <VisualizerSection />
                <ResultSection />
            </div>
        </ContentLayout>
    )
}

export default App
