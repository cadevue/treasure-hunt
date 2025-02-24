const InstructionSection = () => {
    return (
        <section className="w-full flex justify-center">
            <div className="w-lg flex flex-col pt-4 pb-6 px-6 sm:px-12 gap-4
                items-center justify-center border-2 border-main-black rounded-2xl"
            >
                <h2 className="text-2xl font-bold">Use your Own Maze</h2>
                <ol className="w-full text-left">
                    <li>1. Create your own config file (.txt format)</li>
                    <li>2. Upload it in the maze config field</li>
                </ol>
                <h2 className="w-full text-left">Symbol Specification</h2>
                <ul className="w-full text-left">
                    <li> <b>S</b> : Start Point </li>
                    <li> <b>T</b> : Treasure </li>
                    <li> <b>R</b> : Grid that can be accessed (Path) </li>
                    <li> <b>X</b> : Grid that can’t be accessed (Wall) </li>
                </ul>

            </div>
        </section>
    );

}

export default InstructionSection;