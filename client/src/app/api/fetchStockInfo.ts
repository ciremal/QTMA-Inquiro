import { CompanyData, HistoricalData } from "./models";
import { formatDateToYYYYMMDD } from "../lib/formatDateToYYYYMMDD";

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

export const getTickerNews = async (ticker: string): Promise<any[]> => {
  const dateToday = new Date();
  const dateTo = formatDateToYYYYMMDD(dateToday);

  dateToday.setDate(dateToday.getDate() - 5);
  const dateFrom = formatDateToYYYYMMDD(dateToday);

  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${dateFrom}&to=${dateTo}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;

  try {
    const res = await fetch(url);
    const articles = await res.json();

    // Analyze each article for sentiment
    const analyzedArticles = await Promise.all(
      articles.map(async (article: any) => {
        const analysis = await analyzeArticleWithOpenAI(
          article.summary,
          ticker
        );
        article.classification = analysis.classification;
        article.sentiment = analysis.sentiment;
        article.summary = analysis.summary;
        return { ...article, ...analysis };
      })
    );
    // console.log(analyzedArticles);
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

export const getEarningsCallTranscript = async (ticker: string) => {
  try {
    const res = await fetch(
      `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-transcript?ticker=${ticker}`
    );

    const data = await res.json();
    if (!data || !data.transcript || res.status === 404) {
      return {
        transcriptData: null,
        takeaways: null,
      };
    }

    const takeawaysPromise = getEarningsCallHighlights(
      data.summarized,
      data.ticker
    );

    const takeaways = await takeawaysPromise;
    data["takeaways"] = takeaways.takeaways;

    return {
      transcriptData: data,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch earnings call data.");
  }
};
