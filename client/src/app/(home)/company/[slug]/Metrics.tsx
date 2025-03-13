import { Box, List, ListItem } from "@mui/material";
import StatsCard from "./StatsCard";

interface MetricsProps {
  company: any;
}

const Metrics = ({ company }: MetricsProps) => {
  return (
    <Box className="flex w-auto bg-secondaryBlack p-3 border rounded-md border-primaryGray text-white">
      <Box
        className="bg-secondaryBlack"
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
      >
        <List>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="Revenue"
              value={company.totalRevenue}
              status="neutral"
            />
            <StatsCard title="EPS" value={company.forwardEps} status="up" />
          </ListItem>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="Gross"
              value={company.grossMargins}
              status="neutral"
            />
            <StatsCard title="P/E" value={company.forwardPE} status="down" />
          </ListItem>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="EV"
              value={company.enterpriseValue}
              status="down"
            />
            <StatsCard title="EBITDA" value={company.ebitda} status="up" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Metrics;
