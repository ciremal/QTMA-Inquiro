import { Article, CompanyData, HistoricalData } from "./models";
const finnhub = require("finnhub");
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
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "crv02jhr01qpfkbunnjgcrv02jhr01qpfkbunnk0";
  const finnhubClient = new finnhub.DefaultApi();

  const dateToday = new Date();
  const dateTo = formatDateToYYYYMMDD(dateToday);

  dateToday.setDate(dateToday.getDate() - 5);
  const dateFrom = formatDateToYYYYMMDD(dateToday);

  return new Promise((resolve, reject) => {
    finnhubClient.companyNews(
      ticker,
      dateFrom,
      dateTo,
      (error: any, data: any) => {
        if (error) {
          console.error(error);
          reject(new Error("Failed to fetch stock news data."));
        } else {
          resolve(data.slice(0, 12));
        }
      }
    );
  });
};
