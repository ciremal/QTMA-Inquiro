"use client";

import { CompanyData } from "@/app/api/models";
import { Chip } from "@mui/material";
import getIndustryColor from "@/app/lib/industryColors";
import { CompanyLogo } from "@/app/components/companyLogo";
import FavouriteButton from "@/app/components/favouriteButton";
import { UserProvider } from "../../useUserData";
import { useRouter } from "next/navigation";

interface CompanyProps {
  company: CompanyData;
  logo: string;
}

export default function Company({ company, logo }: CompanyProps) {
  const router = useRouter();

  const handleChipClick = (filterType: string, value: string) => {
    router.push(`/categoryPage?${filterType}=${encodeURIComponent(value)}`);
  };

  return (
    <div className="px-10 pt-16 pb-8 flex flex-col gap-12 rounded-md w-full">
      <div className="flex justify-between">
        <div className="flex gap-8 md:flex-row flex-col">
          <CompanyLogo company={company.symbol} logoUrl={logo} />
          <div className="m-auto md:text-start text-center">
            <h1 className="text-neutral-400 text-xl">
              {company.exchange}: {company.symbol}
            </h1>
            <h1 className="font-bold text-4xl mb-4 text-nowrap text-white">
              {company.shortName}
            </h1>
            <div className="flex gap-4">
              <Chip
                className="font-[500] text-primaryWhite"
                label={company.industry}
                onClick={() => handleChipClick("industry", company.industry)}
                sx={{
                  backgroundColor: getIndustryColor(company.industry).bg,
                  color: getIndustryColor(company.industry).color,
                  "&:hover": {
                    backgroundColor: getIndustryColor(company.industry).bg,
                    opacity: 0.8,
                  },
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              />
              <Chip
                className="font-[500] text-primaryWhite"
                label={company.sector}
                onClick={() => handleChipClick("sector", company.sector)}
                sx={{
                  backgroundColor: getIndustryColor(company.sector).bg,
                  color: getIndustryColor(company.sector).color,
                  "&:hover": {
                    backgroundColor: getIndustryColor(company.sector).bg,
                    opacity: 0.8,
                  },
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <UserProvider>
            <FavouriteButton initialState={false} company={company.symbol} />
          </UserProvider>
        </div>
      </div>
    </div>
  );
}
