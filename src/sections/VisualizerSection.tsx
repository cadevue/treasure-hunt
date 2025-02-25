import SectionTitle from "../components/SectionTitle";

const VisualizerSection = () => {
    return (
        <section className="w-full flex flex-col gap-4 items-center justify-center">
            <SectionTitle title="Visualizer" />
            <div className="w-full aspect-square bg-gray-200" />
        </section>
    );
}

export default VisualizerSection;