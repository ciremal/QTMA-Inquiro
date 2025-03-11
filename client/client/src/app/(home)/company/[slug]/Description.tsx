import {
  formatCompanyDescription,
  formatCompanyOwnership,
} from "@/app/lib/formattingFunctions";

interface DescriptionProps {
  company: any;
}

export default function Description({ company }: DescriptionProps) {
  const description = formatCompanyDescription(company);
  const ownershipDesc = formatCompanyOwnership(
    company.companyOfficers,
    company.shortName
  );

  return (
    <div className="px-6 no-scrollbar">
      <p className="text-[14px]">{description}</p>
      <br></br>
      <p className="text-[14px]">{ownershipDesc}</p>
    </div>
  );
}
