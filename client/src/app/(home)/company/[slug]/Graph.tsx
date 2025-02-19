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
  Filler,
  ChartData,
} from "chart.js";
import useSWR, { useSWRConfig } from "swr";
import Crosshair from "chartjs-plugin-crosshair";
import GraphButton from "./GraphButton";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import CurrentPrice from "./CurrentPrice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Crosshair,
  Filler
);
async function getData(company: string, period: string) {
  var interval;

  if (period == "1d" || period == "5d") {
    interval = "1h";
  } else if (period == "5y") {
    interval = "1mo";
  } else if (period == "max") {
    interval = "3mo";
  } else {
    interval = "1d";
  }

  const data = await getTickerHistoricalData(company, period, interval);
  // Check if data is an array
  if (!Array.isArray(data)) {
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
  currPrice: number;
  prevPrice: number;
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

export default function Graph({ company, currPrice, prevPrice }: GraphProps) {
  const { theme } = useTheme();
  const [period, setPeriod] = useState("1y");
  const [comparisonCompany, setComparisonCompany] = useState<string | null>(
    null
  );
  const periods = ["1d", "5d", "1mo", "3mo", "1y", "5y", "max", "ytd"];

  // Fetch data for the currently selected period
  const { data, isLoading, error } = useSWR(
    period,
    () => getData(company, period),
    {
      revalidateOnFocus: false,
    }
  );
  usePrefetchPeriods(company, periods);

  // const handleCompare = (company: string) => {
  //   setComparisonCompany(company);
  // };

  // const comparisonData = periods.map((item) => {
  //   const { data } = useSWR(
  //     `${comparisonCompany}-${item}`,
  //     () => {
  //       if (comparisonCompany) {
  //         return getData(comparisonCompany, item);
  //       }
  //     },
  //     {
  //       revalidateOnFocus: false,
  //       revalidateOnMount: false,
  //     }
  //   );
  //   return { period: item, data: data };
  // });

  const comparisonKey =
    comparisonCompany && period ? `${comparisonCompany}-${period}` : null;

  const chartData = useMemo(() => {
    return {
      labels: data?.map((d) => d.x),
      datasets: [
        {
          key: company,
          data: data?.map((d) => d.y),
          borderColor: "rgba(22, 163, 74, 1)",
          backgroundColor: "rgba(22, 163, 74, 0.3)",
          fill: true,
          pointRadius: 0,
        },
        // comparisonCompany && comparisonData
        //   ? {
        //       key: comparisonKey,
        //       data: comparisonData
        //         .filter((item) => item.period === period)[0]
        //         .data?.map((d) => d.y),
        //       borderColor: "rgba(255, 99, 132, 1)",
        //       backgroundColor: "rgba(255, 99, 132, 0.3)",
        //       fill: true,
        //       pointRadius: 0,
        //     }
        //   : null,
      ].filter(Boolean),
    };
  }, [data, comparisonCompany]) as unknown as ChartData<"line">;

  const options: ChartOptions<"line"> = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "white" : "black",
        },
        border: {
          color: theme === "dark" ? "#757575" : "#a6a6a6",
        },
      },
      y: {
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
          color: theme === "dark" ? "white" : "black",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
      crosshair: {
        line: {
          color: "#4CC0C0", // crosshair line color
          width: 1, // crosshair line width
        },
        zoom: {
          enabled: false,
        },
        snap: {
          enabled: true,
        },
      },
    },
  };

  return (
    <div className="w-[78%] flex flex-col justify-center gap-2">
      <div className="flex items-center">
        <CurrentPrice price={currPrice} previousClose={prevPrice} />
        <div className="flex justify-end gap-4">
          <GraphButton on={period === "1d"} onClick={() => setPeriod("1d")}>
            1D
          </GraphButton>
          <GraphButton on={period === "5d"} onClick={() => setPeriod("5d")}>
            5D
          </GraphButton>
          <GraphButton on={period === "1mo"} onClick={() => setPeriod("1mo")}>
            1M
          </GraphButton>
          <GraphButton on={period === "3mo"} onClick={() => setPeriod("3mo")}>
            3M
          </GraphButton>
          <GraphButton on={period === "1y"} onClick={() => setPeriod("1y")}>
            1Y
          </GraphButton>
          <GraphButton on={period === "5y"} onClick={() => setPeriod("5y")}>
            5Y
          </GraphButton>
          <GraphButton on={period === "max"} onClick={() => setPeriod("max")}>
            Max
          </GraphButton>
          <GraphButton on={period === "ytd"} onClick={() => setPeriod("ytd")}>
            YTD
          </GraphButton>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-center animate-pulse">Fetching data...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load data.</p>
      ) : (
        <div className="w-full h-full">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
