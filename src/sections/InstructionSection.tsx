const InstructionSection = () => {
    return (
        <section className="w-full flex flex-col pt-4 pb-6 px-6 sm:px-12 gap-4
            items-center justify-center border-2 border-main-black rounded-2xl"
        >
            <h2>Create your Own Maze</h2>
            <h3 className="w-full text-left">Symbol Specification</h3>
            <ul className="w-full text-left">
                <li> <b>S</b> : Start Point </li>
                <li> <b>T</b> : Treasure </li>
                <li> <b>R</b> : Grid that can be accessed (Path) </li>
                <li> <b>X</b> : Grid that can’t be accessed (Wall) </li>
            </ul>
            <h3 className="w-full text-left">
                All symbols must be separated by a space. <br/> <br/>
                Example
            </h3>
            <p className="w-full text-left font-mono">
                X T X X <br/>
                X R R T <br/>
                S R X T <br/>
                X R X R <br/>
                X R R R
            </p>
        </section>
    );

}

export default InstructionSection;