import { getTickerInfo } from "@/app/api/fetchStockInfo"
import { notFound } from "next/navigation";
import Company from "./Company";
import Description from "./Description";
import Graph from "./Graph";
import Press from "./Press";

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
        <div className="flex flex-col gap-8 items-center w-11/12 m-auto">
          <Company company={company} logo={logo}/>
          <div className="flex gap-12">
            <Description description={company.longBusinessSummary}/>
            <Graph company={slug}/>
          </div>
          <div className="flex gap-12">
            <Press company={slug}/>
          </div>
        </div>
    )
  }