import { getTickerNews } from "@/app/api/fetchStockInfo";
import PressCard from "./PressCard";
import { Box } from "@mui/material";

interface PressProps {
  company: string;
}

export default async function Press({ company }: PressProps) {
  const news = await getTickerNews(company);

  return (
    <div className="bg-background dark:bg-secondaryBlack border border-slate-300 dark:border-primaryGray rounded-md p-8 box-border w-full">
      <h1 className="font-bold text-xl mb-2">Press Release</h1>
      <Box
        className="flex gap-4 py-4 px-2 bg-background dark:bg-secondaryBlack"
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--primaryGray)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#4E4E4E",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#393939",
            borderRadius: "4px",
          },
        }}
      >
        {news.slice(0, 12).map((article: any) => {
          return <PressCard article={article} key={article.uuid} />;
        })}
      </Box>
    </div>
  );
}
