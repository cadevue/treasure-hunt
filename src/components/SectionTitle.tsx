const SectionTitle = (props: { title : string }) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <h2>{ props.title }</h2>
            <div className="w-full h-px bg-main-black" />
        </div>
    );
}

export default SectionTitle;