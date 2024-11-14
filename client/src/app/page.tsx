"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { getTickerInfo } from "./api/fetchStockInfo";
import Navbar from "./components/navbar";
import Table from "./components/table";
import { redirect } from "next/navigation";

const tickers = [
  "nke",
  "eric",
  "msft",
  "goog",
  "aapl",
  "spot",
  "meta",
  "amzn",
  "tsla",
  "nvda",
];

function Home() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/signup");
  }

  //let data = await getTickerInfo("nke");
  //console.log(data["address1"]);
  // Fetch data for all tickers on the server-side
  // State to hold the fetched data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch data for all tickers
    const fetchData = async () => {
      const dataPromises = tickers.map(async (ticker) => {
        try {
          const data = await getTickerInfo(ticker);
          return data;
        } catch (err) {
          console.error(`Error fetching data for ${ticker}`, err);
          return null;
        }
      });

      // Wait for all promises to resolve
      const resolvedData = await Promise.all(dataPromises);
      // Filter out any null values
      const filteredData = resolvedData.filter((item) => item !== null);
      // Update state with the filtered data
      // console.log(filteredData);
      // @ts-expect-error
      setData(filteredData);
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <main className="flex flex-col h-screen">
      <div className="bg-ingquiro-beige flex-1 flex items-center justify-center">
      <Navbar />
      </div>
      <div
      className="bg-ingquiro-beige flex flex-col items-center justify-center font-DM"
      style={{ height: "60%" }}
      >
      <Typography className="font-DM mb-4" variant="h4" style={{ fontWeight: "bold" }}>
        <span style={{ color: "black" }}>Ask me about</span>
        <span style={{ color: "gray" }}>{` APPL's latest earnings call`}</span>
      </Typography>
      {/* @ts-expect-error */}
      <Table data={data}></Table>
      </div>
    </main>
  );
}

export default Home;
