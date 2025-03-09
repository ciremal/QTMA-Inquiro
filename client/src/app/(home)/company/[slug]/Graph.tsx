"use client";

import { getTickerHistoricalDataBulk } from "@/app/api/fetchStockInfo";
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
  Legend,
} from "chart.js";
import useSWR, { useSWRConfig } from "swr";
import Crosshair from "chartjs-plugin-crosshair";
import GraphButton from "./GraphButton";
import { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import DropdownMenu from "@/app/components/DropdownMenu";
import { InputLabel, Menu, MenuItem, Select } from "@mui/material";
import {
  filterInputLabelStyles,
  filterInputSelectStyles,
} from "@/app/lib/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Crosshair,
  Filler,
  Legend
);
async function getData(
  company: string,
  mutate: (key: string, data: any, shouldRevalidate: boolean) => void
) {
  const historicalData = await getTickerHistoricalDataBulk(company);

  // Check if data is an array
  if (!Array.isArray(historicalData)) {
    throw new Error(
      `Unexpected data format: ${JSON.stringify(historicalData)}`
    );
  }

  const res = historicalData.map((item) => {
    const period = item["period"];
    let data;
    if (period === "1d" || period === "5d") {
      data = item["data"].map((d: any) => ({
        x: new Date(d.Date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
        }),
        y: d.Close,
      }));
    } else {
      data = item["data"].map((d: any) => ({
        x: new Date(d.Date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        y: d.Close,
      }));
    }
    return {
      period: period,
      data: data,
    };
  });

  mutate(`time-series-${company}`, { data: res }, false);
  return res;
}

const findEarlierDataset = (dataset1: any, dataset2: any) => {
  const d1 = new Date(dataset1.data[0].x);
  const d2 = new Date(dataset2.data[0].x);
  if (d1 < d2) {
    return 1;
  } else if (d1 > d2) {
    return 2;
  } else {
    return 0;
  }
};

const adjustLabels = (dataset1: any, dataset2: any) => {
  const earlierDataset = findEarlierDataset(dataset1, dataset2);
  if (earlierDataset === 0) {
    return;
  }

  const datesToAdd = [];
  let index = 0;

  const longerData = earlierDataset === 1 ? dataset1.data : dataset2.data;
  const earliestAlignedDate =
    earlierDataset === 1
      ? new Date(dataset2.data[0].x)
      : new Date(dataset1.data[0].x);

  while (index < longerData.length) {
    const currDate = new Date(longerData[index].x);
    if (currDate < earliestAlignedDate) {
      datesToAdd.push({ x: longerData[index].x, y: 0 });
    } else {
      break;
    }
    index += 1;
  }

  if (earlierDataset === 1) {
    dataset2.data = [...datesToAdd, ...dataset2.data];
  } else {
    dataset1.data = [...datesToAdd, ...dataset1.data];
  }
  return;
};

interface GraphProps {
  company: string;
}

export default function Graph({ company }: GraphProps) {
  const { theme } = useTheme();
  const [period, setPeriod] = useState("1y");
  const { cache, mutate } = useSWRConfig();
  const [comparisonCompany, setComparisonCompany] = useState<string | null>(
    null
  );

  const periods = useMemo(
    () => ["1d", "5d", "1mo", "3mo", "1y", "5y", "max", "ytd"],
    []
  );

  // Fetch data for the currently selected company
  const cacheKey = `time-series-${company}`;
  const { data, isValidating, error } = useSWR(
    cacheKey,
    async () => {
      const cachedData = cache.get(cacheKey);
      return cachedData?.data ?? getData(company, mutate);
    },
    {
      revalidateOnFocus: false,
    }
  );
  const isDataAvailable = cache.get(cacheKey);
  const isLoading = !isDataAvailable || isValidating;

  // Fetch data for the company to be compared with
  const comparisonCompanyCacheKey = `time-series-${comparisonCompany}`;
  const {
    data: comparisonData,
    isValidating: isValidingCompareCompany,
    error: errorCompareCompany,
  } = useSWR(
    comparisonCompanyCacheKey,
    async () => {
      if (!comparisonCompany) {
        return null;
      }
      const cachedData = cache.get(comparisonCompany);
      return cachedData?.data ?? getData(comparisonCompany, mutate);
    },
    {
      revalidateOnFocus: false,
    }
  );
  const isDataAvailableCompareCompany = cache.get(comparisonCompanyCacheKey);
  const isLoadingCompareCompany =
    !isDataAvailableCompareCompany && isValidingCompareCompany;

  const periodData = data
    ? data["data"]?.filter((item: any) => item["period"] === period)[0]
    : { data: null };

  const comparisonPeriodData = comparisonData
    ? comparisonData["data"]?.filter(
        (item: any) => item["period"] === period
      )[0]
    : null;

  if (periodData && comparisonPeriodData) {
    adjustLabels(periodData, comparisonPeriodData);
  }

  const chartData = useMemo(() => {
    return {
      labels: periodData["data"]?.map((d: any) => d.x),
      datasets: [
        {
          label: company,
          data: periodData["data"]?.map((d: any) => d.y.toFixed(2)),
          borderColor: "rgba(22, 163, 74, 1)",
          backgroundColor: "rgba(22, 163, 74, 0.3)",
          fill: true,
          pointRadius: 0,
        },
        comparisonPeriodData
          ? {
              label: comparisonCompany,
              data: comparisonPeriodData["data"]?.map((d: any) =>
                d.y.toFixed(2)
              ),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.3)",
              fill: true,
              pointRadius: 0,
            }
          : null,
      ].filter(Boolean),
    };
  }, [
    company,
    periodData,
    comparisonCompany,
    comparisonData,
    comparisonPeriodData,
  ]) as unknown as ChartData<"line">;

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
          maxTicksLimit: 12,
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
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="md:w-[78%] w-full flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between md:pl-12 mb-3 md:flex-row flex-col gap-5">
        <DropdownMenu
          comparisonCompany={comparisonCompany}
          setComparisonCompany={setComparisonCompany}
        />
        <div className="justify-end gap-4 md:flex hidden">
          {periods.map((p) => {
            return (
              <GraphButton
                key={p}
                on={period === p}
                onClick={() => setPeriod(p)}
              >
                {p.toUpperCase()}
              </GraphButton>
            );
          })}
        </div>
        <div className="w-full md:hidden">
          <Select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--primaryWhite)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--primaryWhite)",
              },
              "& .MuiSelect-select": {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                color: "var(--primaryWhite)",
              },
              "& .MuiSelect-icon": {
                color: "var(--primaryWhite)",
              },
            }}
          >
            {periods.map((industry: any) => (
              // @ts-ignore
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div
        className={`${!isLoadingCompareCompany ? "hidden" : ""} animate-pulse`}
      >
        Fetching {comparisonCompany} data...
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-center animate-pulse">Fetching data...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load data.</p>
      ) : (
        <div className="md:h-full h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
