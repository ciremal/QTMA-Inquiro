import { Article } from "@/app/api/models";
import Link from "next/link";

interface PressCardProps {
    article: Article
}

export default function PressCard({article}: PressCardProps){
    const {title, providerPublishTime, type, thumbnail, link} = article
    const thumbnailUrl = thumbnail ? thumbnail.resolutions[0].url : "https://upload.wikimedia.org/wikipedia/commons/8/8f/Yahoo%21_Finance_logo_2021.png"
    const date = new Date(providerPublishTime * 1000).toLocaleDateString()
    return (
        <div className="flex-shrink-0 basis-[calc(33.333%-1rem)] border rounded-lg shadow-lg">
            <img src={thumbnailUrl} alt="thumbail" className="rounded-t-lg object-cover object-center w-full aspect-[16/9] mb-4"/>
            <div className="p-4">
                <div className="flex justify-between text-sm">
                    <p className="text-slate-500">{date}</p>
                    <p className="text-red-500">{type}</p>
                </div>
                <h1 className="font-bold overflow-ellipsis line-clamp-2 break-words">{title}</h1>
                <p className="text-xs text-slate-500 overflow-ellipsis line-clamp-4 break-words">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quis, suscipit nam necessitatibus tempora quisquam qui recusandae nesciunt laudantium commodi aspernatur saepe maiores quod sed repellendus ipsum aliquam nobis nulla.
                </p>
                <Link href={link} className="block text-right text-cyan-600 mt-8 hover:underline" target="_blank">
                    Read More
                    <img src="/arrow.svg" alt="arrow" className="inline ml-2"/>
                </Link>
            </div>
        </div>
    )
}