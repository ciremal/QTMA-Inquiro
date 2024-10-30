'use client';

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { getTickerInfo } from "./api/fetchStockInfo";
import Table from "./components/table";

const tickers = ["nke", "msft", "goog", "aapl", "spot", "meta", "amzn", "tsla", "nvda", ];

function Home () {
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
          let data = await getTickerInfo(ticker);
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
      console.log(filteredData);
      setData(filteredData);
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once on component mount


  return (
    <main className="flex flex-col h-screen">
      <div className="bg-ingquiro-beige flex-1 flex items-center justify-center">
        {/* 
          header: logo,profile icon
          search bar
        */}
        <Typography className ="font-DM" variant="h4">
          Ask me about APPL's latest earnings call
        </Typography>
      </div>
      <div className="bg-ingquiro-beige flex items-center justify-center font-sans" style={{ height: "60%" }}>
        {/* 
          filters
          table
        */}
        <Table data={data}></Table>
      </div>
    </main>
  );
};

export default Home;
