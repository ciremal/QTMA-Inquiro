export const getDifferences = (data: any[]) => {
  const res = [];

  for (let i = 0; i < data.length; i++) {
    const { currentPrice, previousClose, symbol, marketCap, sector } = data[i];
    const difference = currentPrice - previousClose;
    const percentage = (difference / previousClose) * 100;
    const sec = sector.toLowerCase().replaceAll(" ", "-");
    res.push({
      symbol: symbol,
      currentPrice: currentPrice,
      difference: difference,
      percentage: percentage,
      marketCap: marketCap,
      sector: sec,
    });
  }

  res.sort((a, b) => a.percentage - b.percentage);
  return res;
};
