import { Box, List, ListItem } from "@mui/material";
import StatsCard from "./StatsCard";

interface MetricsProps {
  company: any;
}

const Metrics = ({ company }: MetricsProps) => {
  return (
    <Box className="flex w-auto dark:bg-secondaryBlack bg-background p-3 border rounded-md border-slate-300 dark:border-primaryGray">
      <Box
        className="dark:bg-secondaryBlack bg-background"
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
          <ListItem disablePadding>
            <StatsCard
              title="Revenue"
              value={company.totalRevenue}
              status="neutral"
            />
          </ListItem>
          <ListItem disablePadding>
            <StatsCard title="EPS" value={company.forwardEps} status="up" />
          </ListItem>
          <ListItem disablePadding>
            <StatsCard
              title="Gross"
              value={company.grossMargins}
              status="neutral"
            />
          </ListItem>
          <ListItem disablePadding>
            <StatsCard title="P/E" value={company.forwardPE} status="down" />
          </ListItem>
          <ListItem disablePadding>
            <StatsCard
              title="EV"
              value={company.enterpriseValue}
              status="down"
            />
          </ListItem>
          <ListItem disablePadding>
            <StatsCard title="EBITDA" value={company.ebitda} status="up" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Metrics;
