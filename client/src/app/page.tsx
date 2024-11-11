"use client";
import { Typography } from "@mui/material";
import { getTickerInfo } from "./api/fetchStockInfo";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";


const Home = async () => {
  let data = await getTickerInfo("nke");
  console.log(data);

  return (
    <main className="flex flex-col h-screen">
       <div className="bg-slate-300 flex-1 flex flex-col items-center">
        <Navbar className="w-full p-4 bg-white" /> {/* Ensure Navbar has padding and occupies full width */}
        
        <div className="w-full flex justify-center my-4 mt-6"> {/* Add a top margin to push SearchBar down */}
          <SearchBar onSearch={(term) => console.log("Search term:", term)} />
        </div>
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
