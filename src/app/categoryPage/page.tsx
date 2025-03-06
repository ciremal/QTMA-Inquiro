'use client';

import useSWR from 'swr';
import StockTable from "../components/Table/FilteredCompaniesTable";
import { getTickerInfoBulk } from '../api/fetchStockInfo';

const fetcher = async () => {
  const data = await getTickerInfoBulk();
  return data.filter(
    (item: any) => item !== null && item.longName !== undefined
  );
};

function Home() {
  const { data, error, isLoading } = useSWR("stockData", fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>{`Something went wrong. Please try again later :(`}</div>;
  }

  return (
    <main className="flex flex-col h-screen">
      <div className="flex flex-col items-center justify-center font-sans mt-8">
        <p
          className="font-sans mb-4 md:text-5xl text-2xl text-center"
          style={{ fontWeight: "bold" }}
        >

        </p>
        <div className="w-full">
          <StockTable 
            data={data} 
            isLoading={isLoading} 
            error={error}
          />
        </div>
      </div>
    </main>
  );
}

export default Home;