"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Table from "./components/table";
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
  if (process.env.NODE_ENV !== "development") {
    redirect("/signup");
  }

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
              <span
                style={{ color: "gray" }}
              >{` APPL's latest earnings call`}</span>
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
