"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Table from "./components/Table/TableTemplate";
import { redirect } from "next/navigation";
import { getTickerInfoBulk } from "./api/fetchStockInfo";
import useSWR from "swr";
import Navbar from "./components/navbar";

const fetcher = async () => {
  const data = await getTickerInfoBulk();
  // log all unique industries
  return data.filter(
    (item: any) => item !== null && item.longName !== undefined
  );
};

function Home() {
  // Temporarily redirect users to signup page on production
  // if (process.env.NODE_ENV !== "development") {
  //   redirect("/signup");
  // }
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const prompts = [
      "which companies produce semiconductors",
      "the biggest music software companies",
      "companies in the oil pipeline industry",
      "LULU's change in stock price",
      // "AAPL's most recent 10-K",
    ];
    const rand = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[rand]);
  }, []);

  const { data, error } = useSWR("stockData", fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>{`Something went wrong. Please try again later :(`}</div>;
  } else {
    return (
      <>
        <Navbar />
        <main className="flex flex-col h-screen">
          <div className="bg-ingquiro-beige flex flex-col items-center justify-center font-DM mt-8">
            <Typography
              className="font-DM mb-4"
              variant="h4"
              style={{ fontWeight: "bold" }}
            >
              <span style={{ color: "black" }}>Ask me about</span>
              <span style={{ color: "gray" }}>{` ${prompt}`}</span>
            </Typography>
            {/* @ts-expect-error */}
            <Table data={data}></Table>
          </div>
        </main>
      </>
    );
  }
}

export default Home;
