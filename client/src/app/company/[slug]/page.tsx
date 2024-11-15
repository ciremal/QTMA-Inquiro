import { getTickerInfo } from "@/app/api/fetchStockInfo"
import { notFound } from "next/navigation";
import Company from "./Company";

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
    const logo = `https://assets.parqet.com/logos/symbol/${slug}?format=jpg`

    return (
      <div className="flex flex-col">
        <Company company={company} logo={logo}/>
      </div>
    )
  }