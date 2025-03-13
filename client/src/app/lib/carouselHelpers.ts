export const getData = (data: any[]) => {
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
      image: selectImage(sec),
    });
  }

  res.sort((a, b) => a.percentage - b.percentage);
  return res;
};

export const selectImage = (sector: string) => {
  const randNum = Math.floor(Math.random() * 8) + 1;
  if (sector === "consumer-cyclical" || sector === "consumer-defensive") {
    return `/consumer-${randNum}.jpg`;
  } else if (sector === "energy" || sector === "utilities") {
    return `/energy-${randNum}.jpg`;
  } else {
    return `/${sector}-${randNum}.jpg`;
  }
};
