import { getTickerInfo } from "@/app/api/fetchStockInfo";
import { notFound } from "next/navigation";
import Company from "./Company";
import Description from "./Description";
import Graph from "./Graph";
import Press from "./Press";
import Reports from "./Reports";
import Metrics from "./Metrics";
import EarningsCall from "./EarningsCall";
import Chatbot from "./Chatbot";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const company = await getTickerInfo(slug);
  if (!company || !company.address1) {
    notFound();
  }
  const logo = `/logos/${slug.toUpperCase()}.jpg`;

  return (
    <div className="flex flex-col gap-6 items-center justify-center md:mx-16 mx-4 font-sans">
      <Company company={company} logo={logo} />
      <div className="flex md:max-h-[500px] h-full w-full md:justify-between md:flex-row flex-col gap-10">
        <Graph
          company={slug}
          currentPrice={company.currentPrice}
          previousClose={company.previousClose}
        />
        <Metrics company={company} />
      </div>
      <div className="flex gap-12 w-full md:mt-8 flex-col md:flex-row">
        <div className="flex md:max-w-[60%] w-full flex-col justify-center items-center h-full gap-6">
          <Description company={company} />
          <Press company={slug} />
        </div>
        <div className="flex md:max-w-[40%] w-full flex-col h-full gap-6">
          <Reports cik={company["CIK"].toString()} />
          <EarningsCall ticker={company.symbol} />
        </div>
      </div>
      <Chatbot slug={slug} />
    </div>
  );
}
