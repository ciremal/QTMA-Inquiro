import { CompanyData } from "@/app/api/models";
import { Chip } from "@mui/material";
import getIndustryColor from "@/app/lib/industryColors";
import { CompanyLogo } from "@/app/components/companyLogo";
import FavouriteButton from "@/app/components/favouriteButton";
import { getTickerInfoBulk } from "@/app/api/fetchStockInfo";
import Chips from "@/app/components/Chips";

interface CompanyProps {
  company: CompanyData;
  logo: string;
}

export default async function Company({ company, logo }: CompanyProps) {
  const companies = await getTickerInfoBulk();

  return (
    <div className=" px-10 pt-16 pb-8 flex flex-col gap-12 rounded-md w-full">
      <div className="flex justify-between">
        <div className="flex gap-8">
          <CompanyLogo company={company.symbol} logoUrl={logo} />
          <div className="m-auto">
            <h1 className="text-neutral-400 text-xl">
              {company.exchange}: {company.symbol}
            </h1>
            <h1 className="font-bold text-4xl mb-4 text-nowrap">
              {company.shortName}
            </h1>
            <div className="flex gap-4">
              <Chips company={company} companies={companies} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <FavouriteButton />
        </div>
      </div>
    </div>
  );
}

