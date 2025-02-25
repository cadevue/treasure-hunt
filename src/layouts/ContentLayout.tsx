const ContentLayout = (props: { children: React.ReactNode }) => {
    return (
        <div className="mx-auto px-7 max-w-3xl sm:px-16 w-full h-fit">
            { props.children }
        </div>
    );
}

export default ContentLayout;