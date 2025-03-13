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
        padding={2}
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
        <p className="text-[20px] font-semibold">Financial Snapshot</p>
        <List>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="Revenue"
              value={company.totalRevenue}
              status="up"
              type="value"
            />
            <StatsCard
              title="EPS"
              value={company.forwardEps}
              status="down"
              type="value"
            />
          </ListItem>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="Gross"
              value={company.grossMargins}
              status="up"
              type="multiple"
            />
            <StatsCard
              title="P/E"
              value={company.forwardPE}
              status="down"
              type="multiple"
            />
          </ListItem>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="EV"
              value={company.enterpriseValue}
              status="down"
              type="value"
            />
            <StatsCard
              title="EBITDA"
              value={company.ebitda}
              status="up"
              type="value"
            />
          </ListItem>
          <ListItem disablePadding className="md:flex md:flex-col">
            <StatsCard
              title="EV/EBITDA"
              value={company.enterpriseValue / company.ebitda}
              status="up"
              type="multiple"
            />
            <StatsCard
              title="Market Cap"
              value={company.marketCap}
              status="up"
              type="value"
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Metrics;
