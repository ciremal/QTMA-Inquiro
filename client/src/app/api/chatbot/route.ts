interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const conversation: Message[] = await request.json();
  const url = "https://api.perplexity.ai/chat/completions";
  const bearerToken = process.env.PERPLEXITY_API_KEY;

  // Build request body
  const requestBody = {
    model: "sonar",
    messages: conversation,
    max_tokens: 123,
    temperature: 0.2,
    top_p: 0.9,
    search_domain_filter: null,
    return_images: false,
    return_related_questions: false,
    search_recency_filter: "day",
    top_k: 0,
    stream: true, // <<-- Ensure streaming is enabled
    presence_penalty: 0,
    frequency_penalty: 1,
    response_format: null,
  };

  // Send the POST request with stream = true
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Perplexity responded with status: ${response.status}`);
  }

  // Return the raw streaming body with the correct SSE headers
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      // Some proxies require this to prevent buffering:
      // 'Cache-Control': 'no-cache',
      // 'Connection': 'keep-alive',
      // 'Transfer-Encoding': 'chunked',
    },
  });
}
