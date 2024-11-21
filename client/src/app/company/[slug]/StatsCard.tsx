interface StatsCardProps {
    small?: boolean
    title: string
    value: number
    status: "up" | "down" | "neutral"
}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    notation: 'compact',
    maximumFractionDigits: 2,
    currency: 'USD',
});
export default function StatsCard({small, title, value, status}: StatsCardProps) {
    return (
        <div className={`border rounded-md flex items-center ${small ? "w-52" : "w-60"}`}>
            <img src={`/${status}.svg`} alt="up" className={`${small ? "w-14" : "w-[70px]"}`}/>
            <div>
                <h1 className={`text-slate-500 ${small ? "text-xs" : ""}`}>{title}</h1>
                <p className={`font-bold ${small ? "text-sm" : ""}`}>{formatter.format(value)}</p>
            </div>
        </div>
    )
}