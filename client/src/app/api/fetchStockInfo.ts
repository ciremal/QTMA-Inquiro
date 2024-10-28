export const getTickerInfo = async (ticker: string) => {
  try {
    let res = await fetch(`http://localhost:3001/api/ticker/${ticker}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
};
