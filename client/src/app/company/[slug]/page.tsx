import { getTickerInfo } from "@/app/api/fetchStockInfo"
import { notFound } from "next/navigation";
import Company from "./Company";
import Description from "./Description";
import Graph from "./Graph";

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const slug = (await params).slug
    const company = await getTickerInfo(slug)
    if (!company || !company.address1){
      notFound()
    }
    const logo = `https://assets.parqet.com/logos/symbol/${slug}?format=svg`

    return (
      <div className="flex flex-col gap-8 items-center">
        <Company company={company} logo={logo}/>
        <div className="flex w-5/6 gap-12">
          <Description description={company.longBusinessSummary}/>
          <Graph company={slug}/>
        </div>
      </div>
    )
  }