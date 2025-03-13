"use client";

type CompanyLogoProps = {
  company: string;
  logoUrl: string;
  companyWebsite: string;
};

export const CompanyLogo = ({
  company,
  logoUrl,
  companyWebsite,
}: CompanyLogoProps) => {
  // console.log("Company Website: " + companyWebsite);
  // console.log("Company Symbol: " + company);
  // console.log("Company Logo: " + logoUrl);
  return (
    <img
      src={logoUrl}
      alt={`${company} logo`}
      className="rounded h-full aspect-square"
      onError={(e) => {
        const icon = `https://www.google.com/s2/favicons?domain=${companyWebsite}&sz=256`;
        const img = new Image();
        img.src = icon;
        img.onerror = () => {
          (e.target as HTMLImageElement).src = "https://via.placeholder.com/32";
        };
        (e.target as HTMLImageElement).src = icon;
      }}
    />
  );
};
