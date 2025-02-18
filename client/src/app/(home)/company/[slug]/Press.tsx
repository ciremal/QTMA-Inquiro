import { getTickerNews } from "@/app/api/fetchStockInfo";
import PressCard from "./PressCard";

interface PressProps {
  company: string;
  filter?: string;
}

export default async function Press({ company, filter = "All" }: PressProps) {
  const news = await getTickerNews(company);

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

  const total = sentimentCounts.Bearish + sentimentCounts.Neutral + sentimentCounts.Bullish;
  const bearPercentage = ((sentimentCounts.Bearish / total) * 100);
  const neutralPercentage = ((sentimentCounts.Neutral / total) * 100);
  const bullPercentage = ((sentimentCounts.Bullish / total) * 100);

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
    veryBearish: new Set<string>(),
    bearish: new Set<string>(),
    neutral: new Set<string>(),
    bullish: new Set<string>(),
    veryBullish: new Set<string>(),
  };

  // Helper to get the domain from a URL
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch {
      return "example.com"; // fallback
    }
  };

  news.forEach((article: any) => {
    const sentiment = article.sentiment;
    const domain = getDomainFromUrl(article.url);
    const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    if (sentiment <= -0.6) columns.veryBearish.add(icon);
    else if (sentiment > -0.6 && sentiment <= -0.2) columns.bearish.add(icon);
    else if (sentiment > -0.2 && sentiment <= 0.2) columns.neutral.add(icon);
    else if (sentiment > 0.2 && sentiment <= 0.6) columns.bullish.add(icon);
    else columns.veryBullish.add(icon);
  });

  // Helper to render column with wrapped icons in colored overlay
  const renderColumn = (icons: Set<string>, color: string) => {
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
          {visibleIcons.map((icon, index) => (
            <img key={index} src={icon} alt="news icon" className="py-auto w-10 h-10 rounded-full bg-white" />
          ))}
          {hiddenCount > 0 && (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm">
              +{hiddenCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-secondaryBlack border-2 border-slate-300 dark:border-primaryGray rounded-md p-8 w-3/5 box-border max-h-[800px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-xl">Sentiment Analysis</h1>

        {/* Server-Side Filter Buttons */}
        <form method="get" className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="submit"
              name="filter"
              value={f}
              className={`border px-4 py-2 rounded-3xl font-bold text-xs hover:bg-slate-100 dark:hover:bg-primaryGray transition-all ${
                filter === f ? "bg-slate-100 dark:bg-primaryGray" : ""
              } hover:bg-blue-500`}
            >
              {f}
            </button>
          ))}
        </form>
      </div>
      
      {/* News Cards */}
      <div className="flex gap-4 overflow-x-auto mb-6">
        {news.slice(0, 12).map((article: any) => (
          <PressCard article={article} key={article.uuid} />
        ))}
      </div>
      <div className="flex">
        {/* Sentiment News Distribution */}
        <div className="flex justify-center gap-4 mb-6 mx-2 w-full h-64">
          {renderColumn(columns.veryBearish, "bg-red-500")}
          {renderColumn(columns.bearish, "bg-red-400")}
          {renderColumn(columns.neutral, "bg-gray-400")}
          {renderColumn(columns.bullish, "bg-green-400")}
          {renderColumn(columns.veryBullish, "bg-green-600")}
        </div>

        {/* Sentiment Summary Table */}
        <div className="mb-6 p-4 bg-[rgba(49,49,49,0.85)] text-white rounded-md mx-2 w-full">
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
            <span className={majoritySentiment === "bear" ? "text-red-500" : "text-green-400"}>
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
            <span className="text-red-500">{bearPercentage}%</span>
            <span className="text-gray-400">{neutralPercentage}%</span>
            <span className="text-green-400">{bullPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
