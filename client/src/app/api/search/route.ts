import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import sp500Data from "./companies.json";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!, // Ensure .env.local contains OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    // Check if the API key is present
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 }
      );
    }

    const { query } = await req.json();

    // Validate the query
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query must be a non-empty string" },
        { status: 400 }
      );
    }

    // OpenAI API call with a system prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a financial expert specializing in the S&P 500 index. Only provide relevant information about 
            S&P 500 companies, industries they are part of, and related financial data or analysis. Verify that if a 
            company exists in the S&P500 based on the list below, and then provide a detailed response using the 
            information you know or can infer about the company. If an industry is not explicitly stated in the list, provide 
            a detailed response using the  information you know or can infer Avoid unrelated topics. Also give information about the 
            company,  go into depth about information that might help out investors. Never mention checking out websites, since they 
            are a competitor.

            List of companies in the S&P 500:
            ${sp500Data
              .map(
                (company) =>
                  `- ${company.Security} (${company.Symbol}): ${company["GICS Sector"]}, ${company["GICS Sub-Industry"]}`
              )
              .join("\n")}
            `,
        },
        { role: "user", content: query },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      return NextResponse.json(
        { error: "No relevant information found for the query" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blurb: responseText });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
