import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Ensure .env.local contains OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    // Check if the API key is present
    if (!process.env.OPENAI_API_KEY) {
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
          content:
            "You are a financial expert specializing in the S&P 500 index. Only provide relevant information about S&P 500 companies, industries they are part of, and related financial data or analysis. Avoid unrelated topics. Also give information about the company, go into depth about information that might help out investors.",
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
