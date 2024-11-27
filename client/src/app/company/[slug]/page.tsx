import { getTickerInfo } from "@/app/api/fetchStockInfo";
import { notFound } from "next/navigation";
import Company from "./Company";
import Description from "./Description";
import Graph from "./Graph";
import Press from "./Press";
import Reports from "./Reports";

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
    <div className="flex flex-col gap-8 items-center justify-center mx-16 font-sans mb-10">
      <Company company={company} logo={logo} />
      <div className="flex gap-12 max-h-[430px]">
        <Description description={company.longBusinessSummary} />
        <Graph company={slug} />
      </div>
      <div className="flex gap-12 w-full max-h-[550px]">
        <Press company={slug} />
        <Reports cik={company["CIK"].toString()} />
      </div>
    </div>
  );
}
