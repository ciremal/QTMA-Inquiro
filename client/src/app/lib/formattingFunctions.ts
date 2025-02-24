// Price formatter
export const formatPrice = (price: number) => {
  if (typeof price !== "number") return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Market cap formatter
export const formatMarketCap = (marketCap: number) => {
  if (typeof marketCap !== "number") return marketCap;

  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

// Calculate Stock Price Diff between yesterday close and current price
export const calculatePriceDifference = (
  currentPrice: number,
  previousClose: number
) => {
  const difference = currentPrice - previousClose;
  const percentage = ((difference / previousClose) * 100).toFixed(2);
  const color = difference >= 0 ? "#16A34A" : "#EF4444";
  const formattedDifference = `${
    difference >= 0 ? "+" : ""
  }${difference.toFixed(2)} (${difference >= 0 ? "+" : ""}${percentage}%)`;

  return { formattedDifference, color };
};

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

export const formatTranscript = (transcript: string) => {
  const regex = /^([A-Za-z'\s-]+):\s([\s\S]+?)(?=\n|$)/;
  const res = [];

  while (transcript) {
    // Match the first occurrence
    const match = transcript.match(regex);

    if (match) {
      const entry = {
        name: match[1].trim(),
        sentence: match[2].trim(),
      };

      res.push(entry);

      // Remove the matched part, along with trailing spaces or punctuation
      transcript = transcript
        .replace(regex, "")
        .trim()
        .replace(/^\n?\s*/, "");
    } else {
      break;
    }
  }
  return res;
};
