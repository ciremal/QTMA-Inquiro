import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!, // Ensure .env.local contains OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    // Validate the query
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query must be a non-empty string" },
        { status: 400 }
      );
    }

    const systemPrompt = `
      You are an AI financial assistant. I will provide a query: ${query} and a list of S&P 500 company symbols.
      Your task is to evaluate the query and return the top 10 most relevant companies based off all the sp500 companies, based on how they relate to the query.
      Respond with a list of the top 10 most relevant company symbols based on the query, formatted with the symbols going one line after the other. Do not reply with any other text than the company symbols.
    `;

    // OpenAI API call with a system prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: 500, // Increased max_tokens to allow for longer responses
      temperature: 0.7,
    });

    const responseText =
      completion.choices[0]?.message?.content || "No results found";

    // Parse the response text
    const topCompanies = responseText
      .split("\n")
      .filter((line) => line.trim()) // Ensure non-empty lines
      .slice(0, 10) // Get the first 10 companies
      .map((line) => line.trim()); // Clean up any extra spaces

    // If the response is empty or contains no relevant companies
    if (topCompanies.length === 0) {
      return NextResponse.json(
        { error: "No relevant companies found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      companies: topCompanies,
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
