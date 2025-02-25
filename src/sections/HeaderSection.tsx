const HeaderSection = () => {
    return (
        <header className="w-full flex flex-col items-center justify-center gap-2 sm:gap-4 text-center">
            <h1 className="text-main-red">Treasure Hunt Solver</h1>
            <p className="text-lg sm:text-xl">Search a Treasure in a maze using <b>BFS/DFS</b></p>
        </header>
    )
}

export default HeaderSection