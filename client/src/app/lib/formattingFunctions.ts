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
export const calculatePriceDifference = (currentPrice: number, previousClose: number) => {
  const difference = currentPrice - previousClose;
  const percentage = ((difference / previousClose) * 100).toFixed(2);
  const color = difference >= 0 ? '#16A34A' : '#EF4444';
  const formattedDifference = `${difference >= 0 ? '+' : ''}${difference.toFixed(2)} (${difference >= 0 ? '+' : ''}${percentage}%)`;

  return { formattedDifference, color };
};