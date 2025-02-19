export const formatCompanyDescription = (company: any) => {
  const { longBusinessSummary, city, country } = company;
  const companyDescriptionBlurb = `Based in ${city}, ${country}, ${longBusinessSummary}`;

  return companyDescriptionBlurb;
};

export const formatCompanyOwnership = (
  companyOfficers: any,
  companyName: string
) => {
  const CEO = companyOfficers[0];
  const execTeam = companyOfficers
    .slice(1)
    .reduce((acc: string, curr: any, index: number) => {
      const str =
        index === companyOfficers.length - 2
          ? `and ${curr.name} - ${curr.title}`
          : `${curr.name} - ${curr.title}, `;
      return acc + str;
    }, "");

  const companyOwnershipBlurb = `Management & Ownership: Led by ${CEO.name}, the executive team includes ${execTeam}, driving growth and innovation. ${companyName} is publicly traded and is independently owned.`;
  return companyOwnershipBlurb;
};
