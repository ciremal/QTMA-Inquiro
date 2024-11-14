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
