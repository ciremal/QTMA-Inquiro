import { CompanyData, HistoricalData } from "./models";
import { formatDateToYYYYMMDD } from "../lib/formatDateToYYYYMMDD";

export const getTickerInfo = async (ticker: string): Promise<CompanyData> => {
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

export const getTickerInfoBulk = async () => {
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-list-of-companies`
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
): Promise<HistoricalData[]> => {
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

export const getTickerNews = async (ticker: string): Promise<any> => {
  const dateToday = new Date();
  const dateTo = formatDateToYYYYMMDD(dateToday);

  dateToday.setDate(dateToday.getDate() - 5);
  const dateFrom = formatDateToYYYYMMDD(dateToday);

  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${dateFrom}&to=${dateTo}&token=${process.env.FINNHUB_API_KEY}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch historical data.");
  }
};
