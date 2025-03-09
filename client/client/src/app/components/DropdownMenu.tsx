"use client";

import { Autocomplete, TextField } from "@mui/material";
import tickers from "../../../public/tickers.json";

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
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--primaryWhite)",
      },
      "& fieldset": {
        borderColor: "var(--primaryWhite)",
      },
      "&:hover fieldset": {
        borderColor: "var(--primaryLightGray)",
      },
      "& .Mui-focused fieldset": {
        borderColor: "var(--primaryLightGray)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--primaryWhite)",
    },
    "& .MuiInputBase-input": {
      color: "var(--primaryWhite)",
    },
  };

  const autoCompleteStyle = {
    width: 300,
    "& .MuiSvgIcon-root": {
      color: "var(--primaryWhite)",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "var(--primaryWhite)",
    },
  };

  return (
    <Autocomplete
      disablePortal
      value={comparisonCompany}
      onChange={(e: any, newVal: string | null) => {
        setComparisonCompany(newVal);
      }}
      options={options}
      sx={autoCompleteStyle}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Compare with companies"
          sx={textFieldStyle}
        />
      )}
    />
  );
};

export default DropdownMenu;
