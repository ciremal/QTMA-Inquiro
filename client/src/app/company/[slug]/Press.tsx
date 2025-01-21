import { getTickerNews } from "@/app/api/fetchStockInfo";
import PressCard from "./PressCard";

interface PressProps {
  company: string;
}

export default async function Press({ company }: PressProps) {
  const news = await getTickerNews(company);

  return (
    <div className="bg-white dark:bg-secondaryBlack border-2 border-slate-300 dark:border-primaryGray rounded-md p-8 w-2/3 box-border">
      <h1 className="font-bold text-xl mb-2">Press Release</h1>
      <div className="flex gap-4 overflow-x-auto">
        {news.slice(0, 12).map((article: any) => {
          return <PressCard article={article} key={article.uuid} />;
        })}
      </div>
    </div>
  );
}
