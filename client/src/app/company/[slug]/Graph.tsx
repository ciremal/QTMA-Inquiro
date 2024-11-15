interface DescriptionProps {
    description: string
}

export default function Graph({description}: DescriptionProps) {
    return (
        <div className="bg-white border-slate-300 rounded-md p-12 basis-0 grow-[4]">
            <p>Big Big fancy graph here that is soo so hard to implement :(</p>
        </div>
    )
}