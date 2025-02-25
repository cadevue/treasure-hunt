import SectionTitle from "../components/SectionTitle";

const ResultSection = () => {
    return (
        <section className="w-full flex flex-col gap-4 justify-center">
            <SectionTitle title="Result Summary" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-fit">
                <div className="font-bold">Routes         </div> <div>Value A</div>
                <div className="font-bold">Nodes Visited  </div> <div>Value B</div>
                <div className="font-bold">Execution Time </div> <div>Value C</div>
            </div>
        </section>
    );
}

export default ResultSection;