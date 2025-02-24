import ContentLayout from "./layouts/ContentLayout"
import HeaderSection from "./sections/HeaderSection"
import InstructionSection from "./sections/InstructionSection"

function App() {
    return (
        <ContentLayout>
            <HeaderSection />
            <InstructionSection />
        </ContentLayout>
    )
}

export default App
