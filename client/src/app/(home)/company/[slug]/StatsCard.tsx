interface StatsCardProps {
  small?: boolean;
  title: string;
  value: number;
  type: "value" | "multiple";
  status: "up" | "down" | "neutral";
}
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  notation: "compact",
  maximumFractionDigits: 2,
  currency: "USD",
});
export default function StatsCard({
  small,
  title,
  value,
  type,
  status,
}: StatsCardProps) {
  return (
    <div
      className={`flex items-center gap-4 ${small ? "w-52" : "w-60"} py-2 pl-4`}
    >
      {/* <img src={`/${status}Dark.svg`} alt="up" className={"w-[45px]"} /> */}
      <div>
        <h1 className={`text-slate-500 ${small ? "text-xs" : ""}`}>{title}</h1>
        <p className={`font-bold ${small ? "text-sm" : ""}`}>
          {type === "multiple"
            ? `${value.toFixed(2)}x`
            : formatter.format(value)}
        </p>
      </div>
    </div>
  );
}
