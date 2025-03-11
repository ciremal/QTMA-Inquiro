const industriesColors: { [key: string]: { r: number; g: number; b: number } } =
  {
    "Diagnostics & Research": { r: 179, g: 89, b: 89 }, // Light maroon
    "Consumer Electronics": { r: 89, g: 179, b: 89 }, // Light green
    "Drug Manufacturers - General": { r: 89, g: 89, b: 179 }, // Light blue
    "Travel Services": { r: 255, g: 140, b: 105 }, // Lighter orange-red
    "Medical Devices": { r: 150, g: 100, b: 200 }, // Lighter purple
    "Insurance - Diversified": { r: 140, g: 160, b: 120 }, // Light olive
    "Information Technology Services": { r: 100, g: 180, b: 180 }, // Light teal
    "Software - Infrastructure": { r: 245, g: 76, b: 124 }, // Pink
    Semiconductors: { r: 179, g: 89, b: 179 }, // Light magenta
    "Farm Products": { r: 110, g: 179, b: 110 }, // Lighter forest green
    "Software - Application": { r: 200, g: 100, b: 100 }, // Light firebrick
    "Utilities - Regulated Electric": { r: 120, g: 120, b: 120 }, // Light-medium gray
    "Utilities - Diversified": { r: 140, g: 140, b: 140 }, // Medium-light gray
    "Insurance - Life": { r: 160, g: 120, b: 80 }, // Lighter saddle brown
    "Insurance - Property & Casualty": { r: 90, g: 90, b: 170 }, // Light midnight blue
    "Insurance Brokers": { r: 200, g: 160, b: 80 }, // Lighter dark goldenrod
    "Specialty Chemicals": { r: 100, g: 150, b: 150 }, // Lighter slate gray
    "Medical Instruments & Supplies": { r: 89, g: 150, b: 89 }, // Lighter dark green
    "Security & Protection Services": { r: 180, g: 140, b: 100 }, // Lighter saddle brown
    "Semiconductor Equipment & Materials": { r: 120, g: 170, b: 200 }, // Light steel blue
    "Packaging & Containers": { r: 170, g: 100, b: 100 }, // Lighter dark red
    "Specialty Industrial Machinery": { r: 89, g: 89, b: 179 }, // Light navy blue
    "Asset Management": { r: 89, g: 179, b: 179 }, // Light cyan
    "REIT - Specialty": { r: 110, g: 180, b: 110 }, // Light green
    "Specialty Business Services": { r: 150, g: 190, b: 230 }, // Light cornflower blue
    "Internet Retail": { r: 160, g: 100, b: 80 }, // Lighter saddle brown
    "Computer Hardware": { r: 89, g: 160, b: 89 }, // Lighter dark green
    "Oil & Gas E&P": { r: 200, g: 160, b: 100 }, // Lighter dark goldenrod
    "Electronic Components": { r: 170, g: 100, b: 100 }, // Lighter dark red
    "Auto Parts": { r: 120, g: 170, b: 200 }, // Light steel blue
    "REIT - Office": { r: 140, g: 160, b: 120 }, // Light olive
    "Utilities - Regulated Gas": { r: 160, g: 120, b: 80 }, // Lighter saddle brown
    "REIT - Residential": { r: 100, g: 180, b: 180 }, // Light teal
    "Utilities - Regulated Water": { r: 179, g: 89, b: 179 }, // Light magenta
    "Aerospace & Defense": { r: 89, g: 89, b: 179 }, // Light navy blue
    "Credit Services": { r: 200, g: 160, b: 80 }, // Lighter dark goldenrod
    "Specialty Retail": { r: 170, g: 100, b: 100 }, // Lighter dark red
    "Banks - Diversified": { r: 120, g: 170, b: 200 }, // Light steel blue
    "Oil & Gas Equipment & Services": { r: 150, g: 190, b: 230 }, // Light cornflower blue
    "Building Products & Equipment": { r: 140, g: 160, b: 120 }, // Light olive
    "Packaged Foods": { r: 160, g: 120, b: 80 }, // Lighter saddle brown
    "Medical Distribution": { r: 89, g: 89, b: 179 }, // Light navy blue
    "Pharmaceutical Retailers": { r: 150, g: 100, b: 150 }, // Light purple
    null: { r: 105, g: 105, b: 105 }, // Dim gray
  };

// Helper function to get color for industry
const getIndustryColor = (industry: string): { bg: string; color: string } => {
  const color = industriesColors[industry] || industriesColors.null;
  return {
    bg: `rgba(${color.r}, ${color.g}, ${color.b})`,
    color: `rgb(255, 255, 255)`,
  };
};

export default getIndustryColor;
