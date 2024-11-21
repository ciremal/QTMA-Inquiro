// TO DO: bg color is broken and wont assign it properly. Please Fix.
const generatePastelColorPair = () => {
  // Generate a random base hue
  const hue = Math.floor(Math.random() * 360);

  // Create a pastel background color
  const bgLightness = 90 + Math.floor(Math.random() * 10); // Light background (90-100%)
  const bgSaturation = 20 + Math.floor(Math.random() * 30); // Low saturation (20-50%)
  const bgColor = `hsl(${hue}, ${bgSaturation}%, ${bgLightness}%)`;

  // Create a complementary text color
  const textLightness = 40 + Math.floor(Math.random() * 20); // Dark text (40-60%)
  const textSaturation = 30 + Math.floor(Math.random() * 40); // Moderate saturation (30-70%)
  const textColor = `hsl(${
    (hue + 180) % 360
  }, ${textSaturation}%, ${textLightness}%)`;

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  console.log("Generated bg: " + hslToHex(hue, bgSaturation, bgLightness));
  console.log(
    "Generated color: " +
      hslToHex((hue + 180) % 360, textSaturation, textLightness)
  );
  return {
    bg: hslToHex(hue, bgSaturation, bgLightness),
    color: hslToHex((hue + 180) % 360, textSaturation, textLightness),
  };
};

// Industry color mapping
const industryColors: { [key: string]: { bg: string; color: string } } = {
  "Auto Manufacturers": { bg: "#E3F2FD", color: "#1565C0" },
  "Consumer Electronics": { bg: "#FFB2B2", color: "#FF6565" },
  "Footwear & Accessories": { bg: "#E1F5FE", color: "#0288D1" },
  "Internet Content & Information": { bg: "#E0F7FA", color: "#00838F" },
  "Internet Retail": { bg: "#F3E5F5", color: "#7B1FA2" },
  Semiconductors: { bg: "#F1F8E9", color: "#558B2F" },
  "Software - Infrastructure": { bg: "#E8F5E9", color: "#2E7D32" },

  // Default color for uncategorized industries
  default: generatePastelColorPair(),
};

// Helper function to get color for industry
const getIndustryColor = (industry: string) => {
  return industryColors[industry] || industryColors.default;
};

export default getIndustryColor;
