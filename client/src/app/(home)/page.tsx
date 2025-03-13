"use client";

import React from "react";
import Table from "../components/Table/TableTemplate";
import { getTickerInfoBulk } from "../api/fetchStockInfo";
import useSWR from "swr";
import Typewriter from "../components/Typewriter";
import { TYPE_WRITER_PROMPTS } from "../lib/constants";

const fetcher = async () => {
  const data = await getTickerInfoBulk();
  return data.filter(
    (item: any) => item !== null && item.longName !== undefined
  );
};

function Home() {
  const { data, error } = useSWR("stockData", fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>{`Something went wrong. Please try again later :(`}</div>;
  }

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col items-center justify-center font-sans mt-8">
        <Typewriter prompts={TYPE_WRITER_PROMPTS} />
        {/* @ts-expect-error */}
        <Table data={data} />
      </div>
    </div>
  );
}

export default Home;
