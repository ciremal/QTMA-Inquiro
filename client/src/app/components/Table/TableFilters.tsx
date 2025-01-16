import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { inter } from "../../ui/fonts";

type TableFiltersProps = {
  industryFilter: any;
  setIndustryFilter: any;
  setPage: any;
  industries: any;
  marketCapRange: any;
  setMarketCapRange: any;
  priceRange: any;
  setPriceRange: any;
  handleReset: any;
};

const TableFilters = ({
  industryFilter,
  setIndustryFilter,
  setPage,
  industries,
  marketCapRange,
  setMarketCapRange,
  priceRange,
  setPriceRange,
  handleReset,
}: TableFiltersProps) => {
  return (
    <Box className="w-full flex justify-between items-center">
      <Box className="w-2/3 flex flex-row gap-6">
        <FormControl fullWidth>
          <InputLabel
            sx={{
              "&.MuiInputLabel-root": {
                transform: "translate(0.875rem, 0.5em) scale(1)",
              },
              "&.MuiInputLabel-shrink": {
                transform: "translate(0.875rem, -0.375rem) scale(0.75)",
              },
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Industry
          </InputLabel>
          <Select
            value={industryFilter}
            label="Industry"
            onChange={(e) => {
              setIndustryFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              height: "2.5rem",
              borderRadius: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "0.75rem",
              },
              "& .MuiSelect-select": {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              },
            }}
          >
            <MenuItem value="">All Industries</MenuItem>
            {industries.map((industry: any) => (
              // @ts-ignore
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel
            sx={{
              "&.MuiInputLabel-root": {
                transform: "translate(0.875rem, 0.5em) scale(1)",
              },
              "&.MuiInputLabel-shrink": {
                transform: "translate(0.875rem, -0.375rem) scale(0.75)",
              },
            }}
          >
            Market Cap
          </InputLabel>
          <Select
            value={marketCapRange}
            label="Market Cap"
            onChange={(e) => {
              setMarketCapRange(e.target.value);
              setPage(0);
            }}
            sx={{
              height: "2.5rem",
              borderRadius: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "0.75rem",
              },
              "& .MuiSelect-select": {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              },
            }}
          >
            <MenuItem value="">All Market Caps</MenuItem>
            <MenuItem value="micro">Micro Cap (Under $300M)</MenuItem>
            <MenuItem value="small">Small Cap ($300M - $2B)</MenuItem>
            <MenuItem value="mid">Mid Cap ($2B - $10B)</MenuItem>
            <MenuItem value="large">Large Cap ($10B - $200B)</MenuItem>
            <MenuItem value="mega">Mega Cap (Over $200B)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel
            sx={{
              "&.MuiInputLabel-root": {
                transform: "translate(0.875rem, 0.5em) scale(1)",
              },
              "&.MuiInputLabel-shrink": {
                transform: "translate(0.875rem, -0.375rem) scale(0.75)",
              },
            }}
          >
            Stock Price
          </InputLabel>
          <Select
            value={priceRange}
            label="Price Range"
            onChange={(e) => {
              setPriceRange(e.target.value);
              setPage(0);
            }}
            sx={{
              height: "2.5rem",
              borderRadius: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "0.75rem",
              },
              "& .MuiSelect-select": {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              },
            }}
          >
            <MenuItem value="">All Prices</MenuItem>
            <MenuItem value="under50">Under $50</MenuItem>
            <MenuItem value="50to200">$50 - $200</MenuItem>
            <MenuItem value="over200">Over $200</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className={"px-5"}>
        <FormControl fullWidth>
          <button
            onClick={() => handleReset()}
            className={`text-black ${inter.className} hover:text-gray-600`}
          >
            Clear
          </button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default TableFilters;
