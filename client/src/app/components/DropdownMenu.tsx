"use client";

import { Autocomplete, TextField } from "@mui/material";
import tickers from "../../../public/tickers.json";
import SearchIcon from "@mui/icons-material/Search";

const options = tickers;

interface DropdownMenuProps {
  comparisonCompany: string | null;
  setComparisonCompany: any;
}

const DropdownMenu = ({
  comparisonCompany,
  setComparisonCompany,
}: DropdownMenuProps) => {
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 10,
      "& .MuiOutlinedInput-input": {},
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3F3F3F",
      },
      "&:hover fieldset": {
        borderColor: "var(--primaryGray)",
      },
      "& .Mui-focused fieldset": {
        borderColor: "var(--primaryGray)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--primaryLightGray)",
    },
    "& .MuiInputBase-input": {
      color: "var(--primaryLightGray)",
    },
  };

  const autoCompleteStyle = {
    "& .MuiSvgIcon-root": {
      color: "var(--primaryWhite)",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "var(--primaryWhite)",
    },
    "& .MuiAutocomplete-inputRoot": {
      width: 150,
    },
    "& .MuiAutocomplete-popupIndicator": {
      transform: "none !important",
    },
    "&[aria-expanded='true'] .MuiAutocomplete-popupIndicator": {
      transform: "none !important",
    },
  };

  return (
    <Autocomplete
      popupIcon={
        <SearchIcon
          fontSize="small"
          style={{ color: "var(--primaryLightGray)" }}
        />
      }
      disablePortal
      value={comparisonCompany}
      onChange={(e: any, newVal: string | null) => {
        setComparisonCompany(newVal);
      }}
      options={options}
      sx={autoCompleteStyle}
      renderInput={(params) => (
        <TextField {...params} label="Compare" sx={textFieldStyle} />
      )}
    />
  );
};

export default DropdownMenu;
