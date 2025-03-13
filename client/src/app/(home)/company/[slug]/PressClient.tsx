"use client";

import React, { useState } from "react";
import PressCard from "./PressCard";
import { inter, interBold } from "@/app/ui/fonts";

interface PressClientProps {
  news: any[];
  filters: string[];
  initialFilter: string;
}

const PressClient: React.FC<PressClientProps> = ({
  news,
  filters,
  initialFilter,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  // Filter news based on selected filter
  const filteredNews =
    selectedFilter === "All"
      ? news
      : news.filter(
          (article: any) => article.classification === selectedFilter
        );

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center gap-2 mb-4">
        <p className={`text-xl ${interBold.className} my-auto`}>
          News and Sentiment
        </p>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              name="filter"
              value={f}
              onClick={() => setSelectedFilter(f)}
              className={`border px-4 py-2 rounded-3xl font-bold text-xs hover:bg-primaryGray transition-all ${
                selectedFilter === f ? "bg-primaryGray" : ""
              } hover:bg-blue-500`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards */}
      <div className="flex gap-4 overflow-x-auto mb-6">
        {filteredNews.slice(0, 12).map((article: any) => (
          <PressCard article={article} key={article.uuid} />
        ))}
      </div>
    </div>
  );
};

export default PressClient;
