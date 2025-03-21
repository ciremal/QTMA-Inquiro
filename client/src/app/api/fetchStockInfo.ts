import { CompanyData, HistoricalData } from "./models";
import { formatDateToYYYYMMDD } from "../lib/formatDateToYYYYMMDD";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

interface AnalysisResult {
  summary: string;
  sentiment: number | null;
  classification: "Bullish" | "Bearish" | "Neutral" | null;
}

interface EarningsCallResult {
  takeaways: any[] | null;
  error: string | null;
}

export interface Report {
  date: string;
  form: string;
  cik: number;
}

export interface News {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

// Function to analyze article with OpenAI

export async function analyzeArticleWithOpenAI(
  articleText: string,
  ticker: string
): Promise<AnalysisResult> {
  if (!articleText.trim()) {
    console.warn(
      `Empty article text for ticker: ${ticker}. Assigning default values.`
    );
    return {
      summary: "No article text found.",
      sentiment: 0,
      classification: "Neutral",
    };
  }

  const systemMessage = "You are a helpful financial analysis assistant.";
  const userPrompt = `
You are a financial analyst. Read the following news article about ${ticker}:

\"\"\"
${articleText}
\"\"\"

Perform the following tasks:
1. Provide a concise summary in sentences.
2. Provide an overall sentiment score (numeric) from -1 (extremely negative) to +1 (extremely positive).
3. Classify the article's overall stance as 'Bullish', 'Bearish', or 'Neutral' with respect to ${ticker}.

Return your response as valid JSON only, with the keys: 'summary', 'sentiment', 'classification'.
No code fences or extra text, just valid JSON.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty response from OpenAI.");
    }

    // Remove potential markdown code fences
    content = content.replace(/```json|```/g, "").trim();

    // Parse the JSON response
    const analysis: AnalysisResult = JSON.parse(content);

    // Ensure all required keys are present
    return {
      summary: analysis.summary ?? "No summary provided.",
      sentiment: analysis.sentiment ?? 0,
      classification: analysis.classification ?? "Neutral",
    };
  } catch (error) {
    console.warn(
      `Failed to analyze article for ticker: ${ticker}. Assigning default neutral sentiment. Error: ${error}`
    );
    return {
      summary: "Error during analysis.",
      sentiment: 0,
      classification: "Neutral",
    };
  }
}

export async function getEarningsCallHighlights(
  transcript: string,
  ticker: string
): Promise<EarningsCallResult> {
  if (!transcript.trim()) {
    return {
      takeaways: null,
      error: "No transcript provided",
    };
  }

  const systemMessage = "You are a helpful financial analysis assistant.";
  const userPrompt = `
  You are a financial analyst. Read the following summarized earnings call transcript from ${ticker}:
  
  \"\"\"${transcript}\"\"\"
  
  Perform the following task: Extract the key financial takeaways from the earnings call. Always include numbers and key metrics in the takeaway. Return your response as valid JSON only, with the following format:
  
  {
    "takeaways" : [
      { "title": "title of key financial takeway", "point": "Key financial takeaway (max 20 words)", "sentiment": "Classify the takeaway as positive, neutral, or negative" },
      ...
    ]
  }

  Ensure each takeaway is concise (max 20 words) and financially relevant. Maximum of 4 takeaways. No code fences, no extra text—just valid JSON.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return {
        takeaways: null,
        error: "Empty response from OpenAI",
      };
    }

    // Remove potential markdown code fences
    content = content.replace(/```json|```/g, "").trim();
    const res: EarningsCallResult = JSON.parse(content);

    return res;
  } catch (error) {
    return {
      takeaways: null,
      error: "Failed to fetch transcript analysis",
    };
  }
}

export const getTickerInfo = async (ticker: string): Promise<CompanyData> => {
  try {
    const docRef = doc(db, "companies", ticker);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as CompanyData;
    } else {
      throw new Error(`No data found for ticker: ${ticker}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
};

export const getTickerInfoBulk = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "companies"));
    const companies = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return companies;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
};

export const getEarningsCallTranscript = async (ticker: string) => {
  try {
    const docRef = doc(db, "transcripts", ticker);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const transcriptData = docSnap.data();
      if (!transcriptData.takeaways) {
        const takeawaysPromise = getEarningsCallHighlights(
          transcriptData.summarized,
          transcriptData.ticker
        );
        const { takeaways } = await takeawaysPromise;
        await updateDoc(docRef, {
          takeaways: takeaways,
        });
        return {
          transcript: transcriptData.transcript,
          takeaways: takeaways,
          quarter: transcriptData.quarter,
        };
      } else {
        return {
          transcript: transcriptData.transcript,
          takeaways: transcriptData.takeaways,
          quarter: transcriptData.quarter,
        };
      }
    }

    return {
      transcript: null,
      takeaways: null,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch earnings call data.");
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

export const getTickerHistoricalDataBulk = async (ticker: string) => {
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-time-series-bulk/?ticker=${ticker}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch historical data.");
  }
};

export const getTickerNews = async (ticker: string): Promise<News[]> => {
  const dateToday = new Date();
  const dateTo = formatDateToYYYYMMDD(dateToday);

  dateToday.setDate(dateToday.getDate() - 5);
  const dateFrom = formatDateToYYYYMMDD(dateToday);

  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${dateFrom}&to=${dateTo}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;

  try {
    const res = await fetch(url);
    const articles = await res.json();

    const options = {
      method: "GET",
      headers: {
        "X-Api-Key": `${process.env.NEXT_PUBLIC_API_NINJAS_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    // Analyze each article for sentiment
    const analyzedArticles = await Promise.all(
      articles.map(async (article: any) => {
        const sentimentURL = `https://api.api-ninjas.com/v1/sentiment?text=${encodeURIComponent(
          article.summary
        )}`;
        const response = await fetch(sentimentURL, options);
        const analysis = await response.json();
        article.classification =
          analysis.sentiment === "POSITIVE" ||
          analysis.sentiment === "WEAK_POSITIVE"
            ? "Bullish"
            : analysis.sentiment === "NEGATIVE" ||
              analysis.sentiment === "WEAK_NEGATIVE"
            ? "Bearish"
            : "Neutral";
        article.sentiment = analysis.score;
        return { ...article };
      })
    );
    return analyzedArticles;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch and analyze news data.");
  }
};

export const getReports = async (cik: string): Promise<Report[]> => {
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-reports?cik=${cik}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Field to fetch reports");
  }
};
