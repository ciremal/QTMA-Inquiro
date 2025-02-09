"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Table from "../components/Table/TableTemplate";
import { getTickerInfoBulk } from "../api/fetchStockInfo";
import useSWR from "swr";

const fetcher = async () => {
  const data = await getTickerInfoBulk();
  // log all unique industries
  return data.filter(
    (item: any) => item !== null && item.longName !== undefined
  );
};

function Home() {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const prompts = [
      "which companies produce semiconductors",
      "the biggest music software companies",
      "companies in the oil pipeline industry",
      "LULU's change in stock price",
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
        <main className="flex flex-col h-screen">
          <div className="flex flex-col items-center justify-center font-DM mt-8">
            <p
              className="font-DM mb-4 md:text-5xl text-2xl text-center"
              style={{ fontWeight: "bold" }}
            >
              <span className="text-black dark:text-primaryWhite">
                Ask me about
              </span>
              <span className="text-[#00000066] dark:text-primaryWhite">{` ${prompt}`}</span>
            </p>
            {/* @ts-expect-error */}
            <Table data={data}></Table>
          </div>
        </main>
      </>
    );
  }
}

export default Home;
