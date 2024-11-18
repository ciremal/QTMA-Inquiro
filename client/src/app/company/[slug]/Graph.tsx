"use client"

import { getTickerHistoricalData } from "@/app/api/fetchStockInfo"
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import useSWR from 'swr'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

async function getData(){
    const data = await getTickerHistoricalData("AAPL", "1y", "1d")
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

export default function Graph() {
    const {data, error} = useSWR("whatever", getData)
    if (error) return <div>Failed to load</div>
    if (!data){
        return (
            <div className="bg-white border-slate-300 rounded-md p-12 basis-0 grow-[4]">
                Loading...
            </div>
        )
    }
    console.log(data)
    const chartData = {
        labels: data.map((d) => d.x),
        datasets: [
            {
                label: 'AAPL Stock Price',
                data: data.map((d) => d.y),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    }

    return (
        <div className="bg-white border-slate-300 rounded-md p-12 basis-0 grow-[4]">
            <Line data={chartData} />
        </div>
    )
}