export const generateAskAbout = () => {
  const prompts = [
    "which companies produce semiconductors",
    "the biggest music software companies",
    "companies in the oil pipeline industry",
    "LULU's change in stock price",
    "AAPL's most recent 10-K",
  ];
  const rand = Math.floor(Math.random() * prompts.length);
  return prompts[rand];
};
