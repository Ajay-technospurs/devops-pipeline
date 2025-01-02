export default async function Page() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <h2 className="text-2xl font-semibold ">
                Select a Project
            </h2>
            <p className="text-muted-foreground max-w-md">
                Use the project sidebar to select or create a project. Once selected, you&apos;ll see its details and options here.
            </p>
            {/* <img 
                src="/empty-state.svg" 
                alt="Empty State Illustration" 
                className="w-1/2 max-w-xs opacity-75"
            /> */}
        </div>
    );
}