export const getTickerInfo = async (ticker: string) => {
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev?ticker=${ticker}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
};

export const getTickerInfoBulk = async (tickers: string[]) => {
  try {
    const tickersString = tickers.toString();
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-list-of-companies?tickers=${tickersString}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
};

export const getTickerHistoricalData = async (
  ticker: string,
  period: string,
  interval: string
) => {
  // See possible periods and intervals in ./app/lib/constants
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-stock-time-series?ticker=${ticker}&period=${period}&interval=${interval}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch historical data.");
  }
};

export const getTickerNews = async (ticker: string) => {
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-stock-news?ticker=${ticker}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch stock news data.");
  }
};
