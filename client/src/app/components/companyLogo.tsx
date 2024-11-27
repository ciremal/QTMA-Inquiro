"use client";

type CompanyLogoProps = {
  company: string;
  logoUrl: string;
};

export const CompanyLogo = ({ company, logoUrl }: CompanyLogoProps) => {
  return (
    <img
      src={logoUrl}
      alt={`${company} logo`}
      className="rounded"
      onError={(e) => {
        // @ts-ignore
        e.target.onerror = null;
        // @ts-ignore
        e.target.src = "https://via.placeholder.com/32";
      }}
    />
  );
};
