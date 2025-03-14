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
      className="rounded h-full aspect-square max-h-32 max-w-32"
    />
  );
};
