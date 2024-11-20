"use client";

import { getTickerHistoricalData } from "@/app/api/fetchStockInfo";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartOptions,
} from "chart.js";
import useSWR, { useSWRConfig } from "swr";
import Crosshair from 'chartjs-plugin-crosshair';
import GraphButton from "./GraphButton";
import { useState, useEffect } from "react";

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip,
    Crosshair
  );
async function getData(company: string, period: string) {
  const data = await getTickerHistoricalData(company, period, period === "5y" ? "5d" : "1d");
  // Check if data is an array
  if (!Array.isArray(data)){
    throw new Error(`Unexpected data format: ${JSON.stringify(data)}`);
  }

  return data.map((d) => ({
    x: new Date(d.Date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    y: d.Close,
  }));
}

interface GraphProps {
  company: string;
}

// Custom hook for pre-fetching data
function usePrefetchPeriods(company: string, periods: string[]) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    periods.forEach((period) => {
      mutate(period, getData(company, period), false);
    });
  }, [company, periods, mutate]);
}

export default function Graph({ company }: GraphProps) {
  const [period, setPeriod] = useState("1y");

  // Fetch data for the currently selected period
  const { data, error } = useSWR(period, () => getData(company, period), {
    revalidateOnFocus: false,
  });

  // Pre-fetch other periods in the background
  usePrefetchPeriods(company, ["1mo", "2y", "5y", "ytd"]);

  const chartData = {
    labels: data?.map((d) => d.x),
    datasets: [
      {
        data: data?.map((d) => d.y),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function(value) {
            return `$${value}`
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: data ? `${company.toUpperCase()} Stock Price: ${period.toUpperCase()}` : error ? "Failed to load, retrying..." : "Loading...",
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      crosshair: {
        line: {
          color: '#4CC0C0',  // crosshair line color
          width: 1        // crosshair line width
        },
        zoom: {
            enabled: false
        },
        snap: {
            enabled: true
        },
      }
    }
  };
  

  return (
<div className="bg-white border-2 border-slate-300 rounded-md px-4 py-10 basis-0 grow-[4] flex flex-col justify-center items-center">
  <Line data={chartData} options={options} />
      <div className="flex justify-center gap-4 mt-4">
        <GraphButton on={period === "1mo"} onClick={() => setPeriod("1mo")}>
          1 Month
        </GraphButton>
        <GraphButton on={period === "1y"} onClick={() => setPeriod("1y")}>
          1 Year
        </GraphButton>
        <GraphButton on={period === "2y"} onClick={() => setPeriod("2y")}>
          2 Year
        </GraphButton>
        <GraphButton on={period === "5y"} onClick={() => setPeriod("5y")}>
          5 Year
        </GraphButton>
        <GraphButton on={period === "ytd"} onClick={() => setPeriod("ytd")}>
          YTD
        </GraphButton>
      </div>
    </div>
  );
}