interface StatsCardProps {
    small?: boolean
    title: string
    value: number
}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    notation: 'compact',
    maximumFractionDigits: 2,
    currency: 'USD',
});
export default function StatsCard({small, title, value}: StatsCardProps) {
    return (
        <div className={`border rounded-md flex items-center ${small ? "w-52" : "w-60"}`}>
            <img src="/up.svg" alt="up" className={`${small ? "w-14" : ""}`}/>
            <div>
                <h1 className={`text-slate-500 ${small ? "text-xs" : ""}`}>{title}</h1>
                <p className={`font-bold ${small ? "text-sm" : ""}`}>{formatter.format(value)}</p>
            </div>
        </div>
    )
}