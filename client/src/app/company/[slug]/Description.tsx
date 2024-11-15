interface DescriptionProps {
    description: string
}

export default function Description({description}: DescriptionProps) {
    return (
        <div className="bg-white border-2 border-slate-300 rounded-md px-12 py-8 basis-0 grow-[3] max-h-96 overflow-y-scroll">
            <h1 className="font-bold text-xl ">Company Description</h1>
            <p>{description}</p>
        </div>
    )
}