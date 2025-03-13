import React from "react";
import { getTickerNews } from "@/app/api/fetchStockInfo";
import PressClient from "./PressClient";

interface PressProps {
  company: string;
  filter?: string;
}

export default async function Press({ company, filter = "All" }: PressProps) {
  const news = (await getTickerNews(company)).slice(0, 10);

  // Limit to the first 10 articles
  // Count sentiments
  const sentimentCounts = {
    Bearish: 0,
    Neutral: 0,
    Bullish: 0,
  };

  news.forEach((article: any) => {
    const classification = article.classification;
    if (classification === "Bearish") sentimentCounts.Bearish++;
    else if (classification === "Neutral") sentimentCounts.Neutral++;
    else if (classification === "Bullish") sentimentCounts.Bullish++;
  });

  const total =
    sentimentCounts.Bearish + sentimentCounts.Neutral + sentimentCounts.Bullish;
  const bearPercentage = (sentimentCounts.Bearish / total) * 100;
  const neutralPercentage = (sentimentCounts.Neutral / total) * 100;
  const bullPercentage = (sentimentCounts.Bullish / total) * 100;

  // Calculate majority sentiment (excluding neutral)
  const nonNeutralTotal = sentimentCounts.Bearish + sentimentCounts.Bullish;
  let majoritySentiment = "bear";
  let majorityPercentage = 0;
  if (nonNeutralTotal > 0) {
    majoritySentiment = bearPercentage >= bullPercentage ? "bear" : "bull";
    majorityPercentage = Math.max(bearPercentage, bullPercentage);
  }

  const filters = ["All", "Bearish", "Neutral", "Bullish"];

  // Sort articles into columns based on sentiment
  const columns = {
    veryBearish: new Set<{ icon: string; url: string }>(),
    bearish: new Set<{ icon: string; url: string }>(),
    neutral: new Set<{ icon: string; url: string }>(),
    bullish: new Set<{ icon: string; url: string }>(),
    veryBullish: new Set<{ icon: string; url: string }>(),
  };

  // Helper to get the domain from a Source
  const getDomainFromSource = (source: string) => {
    const knownDomains: { [key: string]: string } = {
      "Yahoo Finance": "finance.yahoo.com",
      Bloomberg: "bloomberg.com",
      Reuters: "reuters.com",
      CNBC: "cnbc.com",
      MarketWatch: "marketwatch.com",
      "The Wall Street Journal": "wsj.com",
      "Financial Times": "ft.com",
      BBC: "bbc.com",
      CNN: "cnn.com",
      Forbes: "forbes.com",
      SeekingAlpha: "seekingalpha.com",
      Finnhub: "finnhub.io",
      // Add more known sources and their domains here
    };

    return knownDomains[source] || source + ".com"; // fallback
  };

  news.forEach((article: any) => {
    const sentiment = article.sentiment;
    const domain = getDomainFromSource(article.source);
    const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    const iconData = { icon, url: article.url };

    if (sentiment <= -0.6) columns.veryBearish.add(iconData);
    else if (sentiment > -0.6 && sentiment <= -0.2)
      columns.bearish.add(iconData);
    else if (sentiment > -0.2 && sentiment <= 0.2)
      columns.neutral.add(iconData);
    else if (sentiment > 0.2 && sentiment <= 0.6) columns.bullish.add(iconData);
    else columns.veryBullish.add(iconData);
  });

  // Helper to render column with wrapped icons in colored overlay
  const renderColumn = (
    icons: Set<{ icon: string; url: string }>,
    color: string
  ) => {
    if (icons.size === 0) {
      return (
        <div className="relative w-16 h-64 flex flex-col items-center border-2 border-dashed border-gray-600 rounded-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[rgba(38,38,38,1)] rounded-full"></div>
        </div>
      );
    }

    const iconArray = Array.from(icons);
    const visibleIcons = iconArray.slice(0, 5);
    const hiddenCount = iconArray.length - 5;

    const heightPercentage = Math.min(iconArray.length * 25, 100); // Max height = 100%

    return (
      <div className="relative w-16 h-64 flex flex-col items-center">
        {/* Dark background (full height) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(38,38,38,1)] rounded-full"></div>

        {/* Colored overlay wrapping icons */}
        <div
          className={`absolute top-0 left-0 w-full ${color} rounded-full flex flex-col items-center justify-center space-y-2 p-2`}
          style={{
            height: `${heightPercentage}%`,
          }}
        >
          {visibleIcons.map(({ icon, url }, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative"
            >
              <img
                src={icon}
                alt="news icon"
                className="py-auto w-10 h-10 rounded-full bg-white"
              />
              {hiddenCount > 0 && index === visibleIcons.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-700/75 text-white text-sm">
                  +{hiddenCount}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-secondaryBlack border-2 border-primaryGray rounded-md p-8 w-full box-border max-h-full text-white">
      <div className="flex items-center justify-between mb-4">
        {/* Client-Side Filter Buttons */}
        <PressClient news={news} filters={filters} initialFilter={filter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sentiment News Distribution */}
        <div className="flex flex-row justify-center gap-4 w-full h-64">
          {renderColumn(
            columns.veryBearish,
            "bg-gradient-to-t from-red-500 to-red-500/50"
          )}
          {renderColumn(
            columns.bearish,
            "bg-gradient-to-t from-[rgba(239,68,68,0.75)] to-[rgba(239,68,68,0.375)]"
          )}
          {renderColumn(
            columns.neutral,
            "bg-gradient-to-t from-gray-400 to-gray-400/50"
          )}
          {renderColumn(
            columns.bullish,
            "bg-gradient-to-t from-[rgba(22,163,74,0.75)] to-[rgba(22,163,74,0.375)]"
          )}
          {renderColumn(
            columns.veryBullish,
            "bg-gradient-to-t from-green-600 to-green-600/50"
          )}
        </div>

        {/* Sentiment Summary Table */}
        <div className="p-4 bg-[rgba(49,49,49,0.85)] text-white rounded-xl w-full h-full">
          <h2 className="font-bold mb-2">Coverage Details</h2>
          <div className="flex justify-between mb-1">
            <span>Total News Sources</span>
            <span>{total}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Leaning Bear</span>
            <span className="text-red-500">{sentimentCounts.Bearish}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Neutral</span>
            <span className="text-gray-400">{sentimentCounts.Neutral}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Leaning Bull</span>
            <span className="text-green-400">{sentimentCounts.Bullish}</span>
          </div>
          <p className="mt-4 text-center text-lg font-semibold">
            {majorityPercentage.toFixed(0)}% of the sources say{" "}
            <span
              className={
                majoritySentiment === "bear" ? "text-red-500" : "text-green-400"
              }
            >
              {majoritySentiment}
            </span>
          </p>

          {/* Sentiment Distribution Bar */}
          <div className="flex h-6 w-full mt-3 rounded-md overflow-hidden">
            <div
              className="bg-red-500"
              style={{ width: `${bearPercentage}%` }}
              title={`${bearPercentage}% Bearish`}
            ></div>
            <div
              className="bg-gray-500"
              style={{ width: `${neutralPercentage}%` }}
              title={`${neutralPercentage}% Neutral`}
            ></div>
            <div
              className="bg-green-500"
              style={{ width: `${bullPercentage}%` }}
              title={`${bullPercentage}% Bullish`}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-red-500">{bearPercentage.toFixed(2)}%</span>
            <span className="text-gray-400">
              {neutralPercentage.toFixed(2)}%
            </span>
            <span className="text-green-400">{bullPercentage.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
