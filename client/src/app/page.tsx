import { Typography } from "@mui/material";
import { getTickerInfo } from "./api/fetchStockInfo";

const Home = async () => {
  let data = await getTickerInfo("nke");
  console.log(data);

  return (
    <main className="flex flex-col h-screen">
      <div className="bg-slate-300 flex-1 flex items-center justify-center">
        {/* 
          header: logo,profile icon
          search bar
        */}
        <Typography variant="h4">
          Ask me about APPL's latest earnings call
        </Typography>
      </div>
      <div className="bg-slate-500" style={{ height: "60%" }}>
        {/* 
          filters
          table
        */}
      </div>
    </main>
  );
};

export default Home;
