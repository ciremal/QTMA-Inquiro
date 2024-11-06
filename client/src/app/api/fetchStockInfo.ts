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
