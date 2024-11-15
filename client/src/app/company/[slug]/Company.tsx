import { CompanyData } from "@/app/api/models"
import { Chip } from "@mui/material";
import getIndustryColor from "@/app/lib/industryColors";
import StatsCard from "./StatsCard";

interface CompanyProps {
    company: CompanyData,
    logo: string
}

export default function Company({company, logo}: CompanyProps) {
    return (
        <div className="bg-white px-10 pt-16 pb-8 flex flex-col gap-12 w-4/5 m-auto rounded-md border-2 border-slate-300 mt-12">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <img src={logo} alt={`${company} logo`} className="rounded"/>
              <div className="m-auto">
                <h1 className="font-bold text-4xl mb-4 text-nowrap">{company.shortName}</h1>
                      <Chip
                        className="font-bold"
                        label={company.industry}
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
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <StatsCard title="EV" value={company.enterpriseValue} small status="down"/>
              <StatsCard title="EBITDA" value={company.ebitda} small status="up"/>
            </div>
          </div>
            <div className="flex gap-4 justify-around">
              <StatsCard title="Revenue" value={company.totalRevenue} status="neutral"/>
              <StatsCard title="EPS" value={company.forwardEps} status="up"/>
              <StatsCard title="Gross" value={company.grossMargins} status="neutral"/>
              <StatsCard title="P/E" value={company.forwardPE} status="down"/>
            </div>
        </div>
    )
}