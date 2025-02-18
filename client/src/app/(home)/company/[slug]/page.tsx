import { getTickerInfo } from "@/app/api/fetchStockInfo";
import { notFound } from "next/navigation";
import Company from "./Company";
import Description from "./Description";
import Graph from "./Graph";
import Press from "./Press";
import Reports from "./Reports";
import Metrics from "./Metrics";

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
  const logo = `https://assets.parqet.com/logos/symbol/${slug}?format=svg`;

  return (
    <div className="flex flex-col gap-6 items-center justify-center mx-16 font-sans mb-10">
      <Company company={company} logo={logo} />
      <div className="flex max-h-[500px] w-full justify-between">
        <Graph
          company={slug}
          currPrice={company.currentPrice}
          prevPrice={company.previousClose}
        />
        <Metrics company={company} />
      </div>
      <div className="flex gap-12 w-full mt-8">
        <div className="flex max-w-[60%] w-full flex-col justify-center items-center h-full gap-6">
          <Description company={company} />
          <Press company={slug} />
        </div>
        <div className="flex max-w-[40%] w-full flex-col h-full">
          <Reports cik={company["CIK"].toString()} />
        </div>
      </div>
    </div>
  );
}
