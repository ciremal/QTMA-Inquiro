import {
  Box,
  Button,
  Popover,
  Chip,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Slider,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { KeyboardArrowDown, Delete } from "@mui/icons-material";
import getIndustryColor from "@/app/lib/industryColors";

type TableFiltersProps = {
  industryFilter: string;
  setIndustryFilter: (industry: string) => void;
  setPage: (page: number) => void;
  industries: string[];
  marketCapRange: string;
  setMarketCapRange: (range: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  setShowFavourites: (show: boolean) => void;
  handleReset: () => void;
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
  setShowFavourites,
  handleReset,
}: TableFiltersProps) => {
  // Popover state management
  const [anchorElIndustry, setAnchorElIndustry] = useState<null | HTMLElement>(
    null
  );
  const [anchorElMarketCap, setAnchorElMarketCap] =
    useState<null | HTMLElement>(null);
  const [anchorElPrice, setAnchorElPrice] = useState<null | HTMLElement>(null);

  const openIndustry = Boolean(anchorElIndustry);
  const openMarketCap = Boolean(anchorElMarketCap);
  const openPrice = Boolean(anchorElPrice);

  const handleOpenIndustry = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElIndustry(event.currentTarget);
  const handleOpenMarketCap = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElMarketCap(event.currentTarget);
  const handleOpenPrice = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElPrice(event.currentTarget);

  const handleCloseIndustry = () => setAnchorElIndustry(null);
  const handleCloseMarketCap = () => setAnchorElMarketCap(null);
  const handleClosePrice = () => setAnchorElPrice(null);

  // Predefined price range options
  const priceOptions = [
    { label: "Under $50", value: [0, 50] },
    { label: "$50 - $200", value: [50, 200] },
    { label: "Over $200", value: [200, 10000] },
  ];

  // Industry filter selection
  const handleIndustryChange = (industry: string) => {
    setIndustryFilter(industry);
    setPage(0);
    handleCloseIndustry();
  };

  // Market Cap filter selection
  const handleMarketCapChange = (cap: string) => {
    setMarketCapRange(cap);
    setPage(0);
    handleCloseMarketCap();
  };

  // Price filter selection
  const handlePriceChange = (price: [number, number]) => {
    setPriceRange(price);
    setPage(0);
    handleClosePrice();
  };

  const handleFavouritesToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowFavourites(e.target.checked);
    setPage(0);
  };

  return (
    <Box className="w-full flex justify-between items-center">
      <Box className="md:w-1/2 w-full flex md:flex-row gap-6 flex-col">
        {/* Industry Filter */}
        <Box className="flex items-center gap-2 w-full">
          <Typography variant="body2" className="text-white">
            Industry
          </Typography>
          <Button
            onClick={handleOpenIndustry}
            className=""
            endIcon={<KeyboardArrowDown />}
            sx={{
              width: "100%",
              backgroundColor: "var(--secondaryBlack)",
              borderRadius: 5,
              paddingX: "1rem",
              paddingY: "0.5rem",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              textTransform: "none", // Set textTransform to none
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
          <Box
            className="p-4 w-60 bg-secondaryBlack text-white rounded-xl border border-primaryGray"
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
                      border: industryFilter.includes(industry)
                        ? "2px solid white"
                        : "none",
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Popover>

        {/* Market Cap Filter */}
        <Box className="flex items-center gap-2 w-full">
          <Typography
            variant="body2"
            sx={{ color: "white", whiteSpace: "nowrap" }}
          >
            Market Cap
          </Typography>
          <Button
            onClick={handleOpenMarketCap}
            endIcon={<KeyboardArrowDown />}
            sx={{
              width: "100%",
              backgroundColor: "var(--secondaryBlack)",
              borderRadius: 5,
              paddingX: "1rem",
              paddingY: "0.5rem",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              textTransform: "none", // Set textTransform to none
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
          <Box
            className="p-4 w-100 bg-secondaryBlack text-white rounded-2xl border border-primaryGray"
            sx={{
              overflowY: "auto", // Enable scrolling if there are too many options
            }}
          >
            <p className="mb-2 font-sans font-semibold">Select Market Cap</p>
            <FormGroup
              sx={{
                "& .MuiFormControlLabel-root": {
                  marginBottom: "0px",
                  padding: 0,
                },
              }}
            >
              {[
                { label: "Micro Cap (Under $300M)", value: "Micro" },
                { label: "Small Cap ($300M - $2B)", value: "Small" },
                { label: "Mid Cap ($2B - $10B)", value: "Mid" },
                { label: "Large Cap ($10B - $200B)", value: "Large" },
                { label: "Mega Cap (Over $200B)", value: "Mega" },
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
                        margin: "0px",
                        p: 0,
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
        <Box className="flex items-center gap-2 w-full">
          <Typography
            variant="body2"
            sx={{ color: "white", whiteSpace: "nowrap" }}
          >
            Stock Price
          </Typography>
          <Button
            onClick={handleOpenPrice}
            endIcon={<KeyboardArrowDown />}
            sx={{
              width: "130px",
              backgroundColor: "var(--secondaryBlack)",
              borderRadius: 5,
              paddingX: "1rem",
              paddingY: "0.5rem",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              border: "1px solid rgba(255,255,255,0.2)", // Light gray border
              textTransform: "none", // Set textTransform to none
              "&:hover": {
                backgroundColor: "rgba(50,50,50,0.5)", // Slightly lighter on hover
                border: "1px solid rgba(255,255,255,0.3)", // More visible on hover
              },
              "&:focus": {
                border: "1px solid white",
              },
            }}
          >
            {priceRange
              ? `$${priceRange[0]} - $${
                  priceRange[1] === 10000 ? "∞" : priceRange[1]
                }`
              : "Any"}
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
            className="p-4 w-90 bg-secondaryBlack text-white rounded-2xl border border-gray-600 shadow-lg"
            sx={{
              height: "auto",
              minHeight: "100px",
            }}
          >
            {/* Slider for Custom Price Selection */}
            <Box className="flex flex-col items-center mt-1 mx-4">
              <Slider
                defaultValue={1}
                min={1}
                max={3}
                step={null}
                valueLabelDisplay="off"
                marks={[
                  {
                    value: 1,
                  },
                  {
                    value: 2,
                  },
                  {
                    value: 3,
                  },
                ]}
                onChange={(e, newValue) => {
                  switch (newValue) {
                    case 1:
                      setPriceRange([0, 50]);
                      break;
                    case 2:
                      setPriceRange([50, 200]);
                      break;
                    case 3:
                      setPriceRange([200, 10000]);
                      break;
                    default:
                      break;
                  }
                }}
                sx={{
                  color: "#646464",
                  width: "100%",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#646464",
                    width: 12, // smaller thumb width
                    height: 12, // smaller thumb height
                  },
                }}
              />
            </Box>
            {/* Price Selection Buttons */}
            <Box className="flex justify-between items-center gap-10 my-1 text-xs">
              {priceOptions.map(({ label, value }) => (
                <Button
                  key={label}
                  onClick={() => handlePriceChange(value as [number, number])}
                  sx={{
                    color: "white",
                    fontSize: 12,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                    paddingX: "0.75rem",
                    paddingY: "0.25rem",
                    backgroundColor:
                      priceRange[0] === value[0] && priceRange[1] === value[1]
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>
        </Popover>
      </Box>

      <Box className={"px-5"}>
        <Switch
          onChange={handleFavouritesToggle}
          sx={{
            width: 64,
            height: 32,
            padding: 0,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: "2px",
              transitionDuration: "300ms",
              "&.Mui-checked": {
                transform: "translateX(32px)",
                "& + .MuiSwitch-track": {
                  backgroundColor: "transparent",
                  opacity: 0.5,
                  border: "1px solid #555",
                },
                "& .MuiSwitch-thumb": {
                  backgroundImage: `url('/favourite-toggle-on.png')`,
                },
              },
            },
            "& .MuiSwitch-thumb": {
              width: 28,
              height: 28,
              backgroundImage: `url('/favourite-toggle.svg')`,
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "#1C1E12",
            },
            "& .MuiSwitch-track": {
              borderRadius: 16,
              backgroundColor: "transparent",
              border: "1px solid #555",
              opacity: 0.5,
              boxSizing: "border-box",
            },
          }}
        />

        <Button
          onClick={handleReset}
          className="text-white bg-transparent rounded-lg px-2 py-2"
        >
          <Delete sx={{ color: "#3F3F3F" }} />
        </Button>
      </Box>
    </Box>
  );
};

export default TableFilters;
