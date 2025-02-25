import SectionTitle from "../components/SectionTitle";

const InputSection = () => {
    return (
        <section className="w-full flex flex-col gap-4">
            <SectionTitle title="Input" />
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="maze" className="font-bold">Select a Maze</label>
                <select name="maze" id="maze" className="w-full p-2 border-2 border-main-black rounded-lg">
                    <option value="option-1">Option 1</option>
                    <option value="option-2">Option 2</option>
                    <option value="option-3">Option 3</option>
                    <option value="custom">Custom Maze</option>
                </select>
            </div>
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="maze-config" className="font-bold">Maze Configuration</label>
                <textarea name="maze-config" id="maze-config" 
                    className="w-full p-2 border-2 border-main-black rounded-lg resize-none" 
                    placeholder="Maze Config"
                    rows={8} 
                />
            </div>
            <button className="w-full p-2 bg-main-red text-white rounded-lg font-bold">Search</button>
        </section>
    );
}

export default InputSection;