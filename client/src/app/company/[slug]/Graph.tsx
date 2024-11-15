interface DescriptionProps {
    description: string
}

export default function Graph({description}: DescriptionProps) {
    return (
        <div className="bg-white border-slate-300 rounded-md p-12 basis-0 grow-[4]">
            <h1 className="font-bold text-lg ">Graph</h1>
            <p>{description}</p>
        </div>
    )
}