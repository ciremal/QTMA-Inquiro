import { Article } from "@/app/api/models";
import Link from "next/link";

interface PressCardProps {
  article: Article;
}

export default function PressCard({ article }: PressCardProps) {
  const {
    datetime,
    headline,
    image,
    summary,
    url,
    source,
    classification,
    sentiment,
  } = article;
  console.log(article);
  const date = new Date(datetime * 1000).toLocaleDateString();
  const thumbnail = image
    ? image
    : "https://upload.wikimedia.org/wikipedia/commons/8/8f/Yahoo%21_Finance_logo_2021.png";

  // Determine badge color based on classification
  const getBadgeColor = () => {
    switch (classification) {
      case "Bullish":
        return "bg-[rgba(22, 163, 74,0.75)]"; // Green 50%
      case "Bearish":
        return "bg-[rgba(239, 68, 68,0.75)]"; // Red 50%
      default:
        return "bg-[rgba(100,100,100,0.75)]"; // Gray 50%
    }
  };

  return (
    <Link
      href={url}
      className="flex-shrink-0 w-64 h-96 border dark:border-primaryGray rounded-lg shadow-lg overflow-hidden relative"
    >
      {/* Badge in the top-right corner */}
      <div
        className={`z-10 absolute top-2 right-2 px-3 py-1 text-xs text-white font-semibold rounded-full ${getBadgeColor()}`}
      >
        {classification} ({sentiment?.toFixed(2) ?? "N/A"})
      </div>

      <div className="flex-shrink-0 h-96 border dark:border-primaryGray rounded-lg shadow-lg overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="w-full aspect-[16/9] h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${thumbnail})` }}
        >
          {/* Gradient Overlay & Text */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent p-4 text-white">
            <h1 className="font-bold text-lg overflow-ellipsis line-clamp-2 break-words mb-2">
              {headline}
            </h1>
            <p className="text-xs text-gray-200 overflow-ellipsis line-clamp-3 break-words mb-4">
              {summary}
            </p>
            <div className="flex-col justify-between text-xs mb-4">
              <p className="text-gray-300">Posted {date}</p>
              <p className="text-gray-300">{source}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
