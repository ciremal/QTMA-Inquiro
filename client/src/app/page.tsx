"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Table from "./components/table";
import { redirect } from "next/navigation";
import sp500Data from "../../public/sp500Data.json";
import { getTickerInfoBulk } from "./api/fetchStockInfo";
import Navbar from "./components/navbar";

const tickers = sp500Data.map((ele) => ele.symbol).slice(0, 25);

function Home() {
  // Temporarily redirect users to signup page on production
  if (process.env.NODE_ENV !== "development") {
    redirect("/signup");
  }

  // State to hold the fetched data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch data for all tickers
    const fetchData = async () => {
      try {
        const data = await getTickerInfoBulk();
        const filteredData = data.filter(
          (item: any) => item !== null && item.longName !== undefined
        );
        setData(filteredData);
      } catch (error) {
        console.error(`Error fetching data for `, error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <main className="flex flex-col h-screen">
      <div
        className="bg-ingquiro-beige flex items-center justify-center font-DM"
      >
        <Typography
          className="font-DM mb-4"
          variant="h4"
          style={{ fontWeight: "bold" }}
        >
          <span style={{ color: "black" }}>Ask me about</span>
          <span
            style={{ color: "gray" }}
          >{` APPL's latest earnings call`}</span>
        </Typography>
        {/* @ts-expect-error */}
        <Table data={data}></Table>
      </div>
    </main>
  );
}

export default Home;
