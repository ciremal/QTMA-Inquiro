"use client"

import { getTickerHistoricalData } from "@/app/api/fetchStockInfo"
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js'
import useSWR from 'swr';
import 'chartjs-plugin-crosshair';
import GraphButton from "./GraphButton";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options: ChartOptions<'line'> = {
    interaction: {
        mode: 'index',
        intersect: false,
    },
}

async function getData(company: string, period: string) {
    let interval = "1d"
    if (period === "2y" || period === "5y") {
        interval = "1wk"
    }
    const data = await getTickerHistoricalData(company, period, interval)
    return data.map((d) => {
        return {
            x: (new Date(d.Date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })),
            y: d.Close,
        }
    })
}

interface GraphProps {
    company: string
}

export default function Graph({company}: GraphProps) {
    const [period, setPeriod] = useState("1y");
    const {data, error} = useSWR(period, async ()=> getData(company, period))

    if (error) return <div>Failed to load</div>

    const chartData = {
        labels: data?.map((d) => d.x),
        datasets: [
            {
                label: 'AAPL Stock Price',
                data: data?.map((d) => d.y),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    }


    return (
        <div className="bg-white border-slate-300 rounded-md p-8 basis-0 grow-[4]">
            <Line data={chartData}
            options={options}
            />
            <div className="flex justify-center gap-4 mt-4">
                <GraphButton on={period === "1mo"} onClick={() => setPeriod("1mo")}>1 Month</GraphButton>
                <GraphButton on={period === "1y"} onClick={() => setPeriod("1y")}>1 Year</GraphButton>
                <GraphButton on={period === "2y"} onClick={() => setPeriod("2y")}>2 Year</GraphButton>
                <GraphButton on={period === "5y"} onClick={() => setPeriod("5y")}>5 Year</GraphButton>
                <GraphButton on={period === "ytd"} onClick={() => setPeriod("ytd")}>YTD</GraphButton>
            </div>
        </div>
    )
}