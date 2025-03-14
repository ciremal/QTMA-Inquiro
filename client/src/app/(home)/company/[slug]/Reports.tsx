import { ReportsCard } from "./ReportsCard";
import { Box } from "@mui/material";

interface ReportsProps {
  cik: string;
}

const Reports = async ({ cik }: ReportsProps) => {
  return (
    <Box className="border border-primaryGray rounded-md p-6 bg-secondaryBlack text-white">
      <Box
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--primaryGray)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#4E4E4E",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#393939",
            borderRadius: "4px",
          },
        }}
        className="bg-secondaryBlack max-h-[420px] overflow-auto"
      >
        <ReportsCard cik={cik} />
      </Box>
    </Box>
  );
};

export default Reports;
