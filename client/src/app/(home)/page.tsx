"use client";

import React, { useEffect, useState } from "react";
import Table from "../components/Table/TableTemplate";
import { getTickerInfoBulk } from "../api/fetchStockInfo";
import useSWR from "swr";
import Carousel from "../components/Carousel";

const prompts = [
  // Industry-specific queries
  "which companies produce semiconductors",
  "the biggest music software companies",
  "which companies focus on green energy",
  "the largest retail warehouse stores",
  "leading electric vehicle manufacturers",
  "the most popular biotech companies",
  "companies in the oil pipeline industry",
  "the top cloud computing providers",
  "largest social media platforms",
  "leading aerospace and defense companies",

  // General stock questions
  "the best performing stocks in the S&P 500",
  "LULU's change in stock price",
  "the most volatile tech stocks",
  "the highest dividend-paying companies",
  "companies with the largest market capitalization",

  // Thematic or trending topics
  "which companies are exploring artificial intelligence",
  "emerging 3D printing companies to watch",
  "the best cybersecurity stocks",
  "top gaming and esports companies",
  "leading streaming media services",
];

const fetcher = async () => {
  const data = await getTickerInfoBulk();
  return data.filter(
    (item: any) => item !== null && item.longName !== undefined
  );
};

function Home() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");

  useEffect(() => {
    const prompt = prompts[promptIndex];
    // console.log(`Current prompt index: ${promptIndex}`);
    // console.log(`Current prompt: ${prompt}`);

    if (!prompt) return;

    let i = 0;
    let timeoutId: NodeJS.Timeout;

    function resetTypewriter() {
      setTypedPrompt("");
      i = 0;
      // Pick a brand-new random index for the next prompt
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * prompts.length);
      } while (newIndex === promptIndex);
      // console.log(`New prompt index: ${newIndex}`);
      setPromptIndex(newIndex);
    }

    function typeWrite() {
      if (i < prompt.length) {
        setTypedPrompt(prompt.slice(0, i + 1));
        i++;
        timeoutId = setTimeout(typeWrite, 100);
      } else {
        // After typing finishes, wait 2 seconds, then move to next prompt
        timeoutId = setTimeout(() => {
          resetTypewriter();
        }, 2000);
      }
    }

    setTypedPrompt("");
    typeWrite();

    return () => clearTimeout(timeoutId);
  }, [promptIndex]);

  const { data, error } = useSWR("stockData", fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>{`Something went wrong. Please try again later :(`}</div>;
  }

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col items-center justify-center font-sans mt-8">
        <p
          className="font-sans mb-4 md:text-5xl text-2xl text-center"
          style={{ fontWeight: "bold" }}
        >
          <span className="text-black dark:text-primaryWhite">
            Ask me about{" "}
          </span>
          <span className="text-[#00000066] dark:text-primaryWhite">
            {typedPrompt}
          </span>
        </p>
        {/* @ts-expect-error */}
        <Table data={data} />
      </div>
    </div>
  );
}

export default Home;
