import ContentLayout from "./layouts/ContentLayout"
import HeaderSection from "./sections/HeaderSection"
import InputSection from "./sections/InputSection"
import InstructionSection from "./sections/InstructionSection"

function App() {
    return (
        <ContentLayout>
            <div className="flex flex-col items-center gap-10 py-10">
                <HeaderSection />
                <InstructionSection />
                <InputSection />
            </div>
        </ContentLayout>
    )
}

export default App
