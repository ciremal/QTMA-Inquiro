import { Box, Button, Popover, Chip, FormControl, FormGroup, FormControlLabel, Checkbox, Typography, Slider } from "@mui/material";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  filterInputLabelStyles,
  filterInputSelectStyles,
} from "@/app/lib/styles";
import { KeyboardArrowDown, Delete } from "@mui/icons-material";
import getIndustryColor from "@/app/lib/industryColors";

type TableFiltersProps = {
  industryFilter: any;
  setIndustryFilter: any;
  setPage: any;
  industries: any;
  marketCapRange: any;
  setMarketCapRange: any;
  priceRange: [number, number];
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
  const { theme } = useTheme();

  const filterInputLabelStyles = () => ({
    "&.MuiInputLabel-root": {
      transform: "translate(0.875rem, 0.5em) scale(1)",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(0.875rem, -0.375rem) scale(0.75)",
    },
  });

  const filterInputSelectStyles = (theme: string | undefined) => ({
    height: "2.5rem",
    // Styling the border
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "2rem",
      borderColor:
        theme === "dark" ? "var(--primaryGray)" : "var(--primaryLightGray)",
    },
    // Styling the border on hover
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme === "dark" ? "white" : "#1976D2",
    },
    // Styling the inside of the component
    "& .MuiSelect-select": {
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      color: theme === "dark" ? "var(--primaryLightGray)" : "var(--primaryGray)",
    },
    // Styling the dropdown icon
    "& .MuiSelect-icon": {
      color:
        theme === "dark" ? "var(--primaryLightGray)" : "var(--primaryGray)",
    },
  });

  return (
    <Box className="w-full flex justify-between items-center">
      <Box className="md:w-2/3 w-full flex flex-row gap-6">
        <FormControl fullWidth>
          <InputLabel
            className="dark:text-primaryLightGray"
            sx={filterInputLabelStyles()}
          >
            {industryFilter || "Any"}
          </Button>
        </Box>
        <Popover
          open={openIndustry}
          anchorEl={anchorElIndustry}
          onClose={handleCloseIndustry}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "transparent", // Ensure the background is transparent
              boxShadow: "none", // Remove any unwanted shadows
            },
          }}
        >
          <Box className="p-4 w-60 bg-secondaryBlack text-white rounded-xl border border-primaryGray"
          sx={{
            height: "300px", // Set a fixed height
            overflowY: "auto", // Enable scrolling if there are too many industries
          }}
          >
            <p className="mb-2 font-sans font-semibold">Select Industry</p>
            <Box className="flex gap-2 flex-wrap">
            {industries.map((industry) => {
              const { bg, color } = getIndustryColor(industry);
              return (
                <Chip
                  key={industry}
                  label={industry}
                  onClick={() => handleIndustryChange(industry)}
                  sx={{
                    backgroundColor: bg,
                    color: color,
                    "&:hover": { opacity: 0.8 },
                    cursor: "pointer",
                    fontWeight: 500,
                    border: industryFilter.includes(industry) ? "2px solid white" : "none",
                  }}
                />
              );
            })}
            </Box>
          </Box>
        </Popover>

        {/* Market Cap Filter */}
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="text-white">Market Cap</Typography>
          <Button
            onClick={handleOpen(setAnchorElMarketCap)}
            className="flex items-center justify-between px-4 py-2 w-42 bg-[rgba(31,31,31,0.4)] text-white text-xs rounded-full border border-primaryGray"
            endIcon={<KeyboardArrowDown />}
            sx={{
              backgroundColor: "rgba(31,31,31,0.4)",
              border: "1px solid rgba(255,255,255,0.2)", // Light gray border
              "&:hover": {
                backgroundColor: "rgba(50,50,50,0.5)", // Slightly lighter on hover
                border: "1px solid rgba(255,255,255,0.3)", // More visible on hover
              },
              "&:focus": {
                border: "1px solid white",
              },
            }}
          >
            {marketCapRange || "Any"}
          </Button>
        </Box>
        <Popover
          open={openMarketCap}
          anchorEl={anchorElMarketCap}
          onClose={handleCloseMarketCap}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "transparent", // Ensure the background is transparent
              boxShadow: "none", // Remove any unwanted shadows
            },
          }}
        >
          <Box className="p-4 w-100 bg-secondaryBlack text-white rounded-xl border border-primaryGray"
          sx={{
            overflowY: "auto", // Enable scrolling if there are too many options
          }}
          >
            <p className="mb-2 font-sans font-semibold">Select Market Cap</p>
            <FormGroup sx={{ "& .MuiFormControlLabel-root": { marginBottom: "0px" } }}>
              {[
              { label: "Micro Cap (Under $300M)", value: "micro" },
              { label: "Small Cap ($300M - $2B)", value: "small" },
              { label: "Mid Cap ($2B - $10B)", value: "mid" },
              { label: "Large Cap ($10B - $200B)", value: "large" },
              { label: "Mega Cap (Over $200B)", value: "mega" },
              ].map(({ label, value }) => (
              <FormControlLabel
                key={value}
                control={
                <Checkbox
                  checked={marketCapRange === value}
                  onChange={() => handleMarketCapChange(value)}
                  sx={{
                    color: "grey",
                    transform: "scale(0.8)", // Adjust the scale to make the checkbox smaller
                    "&.Mui-checked": {
                      color: "grey",
                    },
                    margin: "0px"
                  }}
                />
                }
                label={label}
                sx={{
                display: "flex",
                alignItems: "center",
                "& .MuiFormControlLabel-label": {
                  fontWeight: 400,
                  fontSize: "0.875rem", // text-xs equivalent in Tailwind CSS
                },
                }}
              />
              ))}
            </FormGroup>
          </Box>
        </Popover>

        {/* Stock Price Filter */}
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="text-white">Stock Price</Typography>
          <Button
            onClick={handleOpen(setAnchorElPrice)}
            className="flex items-center justify-between px-4 py-2 w-42 bg-[rgba(31,31,31,0.4)] text-white text-xs rounded-full border border-primaryGray"
            endIcon={<KeyboardArrowDown />}
            sx={{
              backgroundColor: "rgba(31,31,31,0.4)",
              border: "1px solid rgba(255,255,255,0.2)", // Light gray border
              "&:hover": {
                backgroundColor: "rgba(50,50,50,0.5)", // Slightly lighter on hover
                border: "1px solid rgba(255,255,255,0.3)", // More visible on hover
              },
              "&:focus": {
                border: "1px solid white",
              },
            }}
          >
            {priceRange ? `$${priceRange[0]} - $${priceRange[1] === 10000 ? '∞' : priceRange[1]}` : "Any"}
          </Button>
        </Box>
        <Popover
          open={openPrice}
          anchorEl={anchorElPrice}
          onClose={handleClosePrice}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        >
          <Box
            className="p-4 w-90 bg-secondaryBlack text-white rounded-xl border border-gray-600 shadow-lg"
            sx={{
              height: "auto",
              minHeight: "160px",
            }}
          >

            {/* Slider for Custom Price Selection */}
            <Box className="flex flex-col items-center mt-6 mx-4">
              <Slider
              min={0}
              max={10000}
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              sx={{
                color: "white",
                "& .MuiSlider-thumb": { backgroundColor: "white" },
              }}
              />
            </Box>
            {/* Price Selection Buttons */}
            <Box className="flex justify-between items-center gap-3 my-4">
              {priceOptions.map(({ label, value }) => (
                <Button
                  key={label}
                  onClick={() => handlePriceChange(value)}
                  className={`text-white text-xs rounded-full border-1 border-rgba(255,255,255,0.2) rounded-full px-3 py-1`}
                  sx={{
                    backgroundColor: priceRange[0] === value[0] && priceRange[1] === value[1] ? "rgba(255,255,255,0.2)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    border: "1px solid rgba(255,255,255,0.2)", 
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
            <Typography variant="body2" className="mt-2 text-xs text-primaryGray mx-auto text-center">
              Selected Price: ${priceRange[0]} - ${priceRange[1] === 10000 ? '∞' : priceRange[1]}
              </Typography>
          </Box>
        </Popover>

      </Box>

      <Box className={"px-5"}>
        <Button onClick={handleReset} className="text-white bg-transparent rounded-lg px-2 py-2">
          <Delete />
        </Button>
      </Box>
    </Box>
  );
};

export default TableFilters;
