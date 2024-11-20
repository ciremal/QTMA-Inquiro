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

  if (error) return <div>Failed to load</div>;

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
    plugins: {
      title: {
        display: true,
        text: data ? `${company.toUpperCase()} Stock Price: ${period.toUpperCase()}` : "Loading...",
      },
      tooltip: {
        mode: 'index',
        intersect: false
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
    <div className="bg-white border-slate-300 rounded-md p-8 basis-0 grow-[4]">
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