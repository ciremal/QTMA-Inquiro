import { getTickerNews } from "@/app/api/fetchStockInfo"
import PressCard from "./PressCard"

interface PressProps {
    company: string
}

export default async function Press({company}: PressProps) {
    const news = await getTickerNews(company)
    return (
        <div className="bg-white border-2 border-slate-300 rounded-md p-8 w-2/3">
            <h1 className="font-bold text-xl mb-2">Press Release</h1>
            <div className="flex gap-4 overflow-x-auto">
                {news.map((article)=>{
                    return <PressCard article={article} key={article.uuid}/>
                })}
            </div>
        </div>
    )
}