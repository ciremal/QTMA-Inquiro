"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Table from "./components/table";
import { redirect } from "next/navigation";
import sp500Data from "../../public/sp500Data.json";
import { getTickerInfoBulk } from "./api/fetchStockInfo";

const tickers = sp500Data.map((ele) => ele.symbol).slice(0, 25);

function Home() {
  // Temporarily redirect users to signup page on production
  if (process.env.NODE_ENV !== "development") {
    redirect("/signup");
  }

  // State to hold the fetched data
  const [data, setData] = useState([]);

  // Number of tickers to fetch at once
  const batchSize = 10;
  const dataPromises: any[] = [];

  useEffect(() => {
    // Function to fetch data for all tickers
    const fetchData = async () => {
      for (let i = 0; i < tickers.length; i += batchSize) {
        const batch = tickers.slice(i, i + batchSize);
        try {
          const info = await getTickerInfoBulk(batch);
          dataPromises.push(...info);
        } catch (error) {
          console.error(`Error fetching data for ${batch}`, error);
        }
      }

      // const dataPromises = tickers.map(async (ticker) => {
      //   try {
      //     const data = await getTickerInfo(ticker);
      //     return data;
      //   } catch (err) {
      //     console.error(`Error fetching data for ${ticker}`, err);
      //     return null;
      //   }
      // });

      // Wait for all promises to resolve
      const resolvedData = await Promise.all(dataPromises);
      // Filter out any null values
      const filteredData = resolvedData.filter((item) => item !== null);
      // Update state with the filtered data
      // @ts-expect-error
      setData(filteredData);
    };

    // Call the fetchData function
    fetchData();
  }, [tickers]); // Empty dependency array to run only once on component mount

  return (
    <main className="flex flex-col h-screen">
      <div className="bg-ingquiro-beige flex-1 flex items-center justify-center">
        <Typography className="font-DM" variant="h4">
          {`Ask me about APPL's latest earnings call`}
        </Typography>
      </div>
      <div
        className="bg-ingquiro-beige flex items-center justify-center font-DM"
        style={{ height: "60%" }}
      >
        {/* @ts-expect-error */}
        <Table data={data}></Table>
      </div>
    </main>
  );
}

export default Home;
