"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface StatsCardProps {
  small?: boolean;
  title: string;
  value: number;
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
  status,
}: StatsCardProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`flex items-center ${small ? "w-52" : "w-60"}`}>
      <img
        src={theme === "dark" ? `/${status}Dark.svg` : `/${status}.svg`}
        alt="up"
        className={`${small ? "w-14" : "w-[70px]"}`}
      />
      <div>
        <h1 className={`text-slate-500 ${small ? "text-xs" : ""}`}>{title}</h1>
        <p className={`font-bold ${small ? "text-sm" : ""}`}>
          {formatter.format(value)}
        </p>
      </div>
    </div>
  );
}
